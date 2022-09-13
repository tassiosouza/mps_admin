// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { OrderStatus } from 'src/models'
import { listMpsSubscriptions, listDrivers, listMRoutes, listMOrders, getMRoute } from '../../../graphql/queries'
import { createMRoute, createMOrder, updateMRoute, updateDriver, deleteMRoute, deleteMOrder, updateMpsSubscription } from '../../../graphql/mutations'

// ** Axios Party Imports
import axios from 'axios'
import { RouteStatus } from 'src/models'
import { AssignStatus } from 'src/models'
import { SubscriptionStatus } from 'src/models'
import { Api } from 'mdi-material-ui'

export const getLocations = async (params)  => {
  var locations = []
  const filter = {
    status: {
      eq: SubscriptionStatus.ACTIVED
    }
  }

  // ** Query Server Subscriptions
  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    filter,
    limit: 5000
  }))

  response.data.listMpsSubscriptions.items.map(sub => {
    var locationName = sub.location
    var registeredLocation = locations.find(loc => loc.name == locationName)
    if(registeredLocation) {
      registeredLocation.deliveries += 1
    }
    else {
      locations.push({
        name: locationName,
        deliveries: 1,
        included: false
      })
    }
  })
  
  const filtered = locations.filter(loc => loc.name.toLowerCase().includes(params.q.toLowerCase()))
  return {locations: filtered, subscriptions: response.data.listMpsSubscriptions.items} 
}

export const getDrivers = async (params)  => {
  // ** Query Server Drivers
  const response = await API.graphql(graphqlOperation(listDrivers, {
    limit: 5000
  }))

  const filteredDrivers = response.data.listDrivers.items.filter(driver => {
    return driver.name.toLowerCase().includes(params.query.toLowerCase())
  })
  
  return filteredDrivers;
}

export const assignAmplifyDriver = async (routeID, driverID)  => {
  // ** Query Route to be Assigned
  const qResponse = await API.graphql(graphqlOperation(getMRoute, {id: routeID}))
  const route = qResponse.data.getMRoute ? qResponse.data.getMRoute : null
  if(route != null) {
    if(route.driverID != '') {
      return {route: null, error: 'Route already assigned', driver: null}
    }
    else {
      // ** Assign driver to the route in Amplify
      const routeToUpdate = {
        id: route.id,
        driverID: driverID,
        status: RouteStatus.ASSIGNED
      };
      const driverToUpdate = {
        id: driverID,
        assignStatus: AssignStatus.ASSIGNED
      };
      const updatedRoute = await (await API.graphql(graphqlOperation(updateMRoute, {input: routeToUpdate}))).data.updateMRoute;
      const updatedDriver = await (await API.graphql(graphqlOperation(updateDriver, {input: driverToUpdate}))).data.updateDriver;

      return {route: updatedRoute, error: null, driver: updatedDriver}
    }
  }
  else {
    return {
      error: 'Invalid route id'
    }
  }
}

export const unassignAmplifyDriver = async (routeID, driverID)  => {
  // ** Query Route to be Unassigned
  const qResponse = await API.graphql(graphqlOperation(getMRoute, {id: routeID}))
  const route = qResponse.data.getMRoute ? qResponse.data.getMRoute : null
  if(route != null) {
    if(route.driverID == '') {
      return {route: null, error: 'Route already unassigned', driver: null}
    }
    if(route.status != RouteStatus.ASSIGNED) {
      return {route: null, error: 'This route can not be unassigned', driver: null}
    }
    else {
      // ** Unassign driver to the route in Amplify
      const routeToUpdate = {
        id: route.id,
        driverID: '',
        status: RouteStatus.PLANNED
      };
      const driverToUpdate = {
        id: driverID,
        assignStatus: AssignStatus.UNASSIGNED
      };
      const updatedRoute = await (await API.graphql(graphqlOperation(updateMRoute, {input: routeToUpdate}))).data.updateMRoute;
      const updatedDriver = await (await API.graphql(graphqlOperation(updateDriver, {input: driverToUpdate}))).data.updateDriver;

      return {route: updatedRoute, error: null, driver: updatedDriver}
    }
  }
  else {
    return {
      error: 'Could not find a route to unassign'
    }
  }
}

export const deleteRoute = async (route, orders)  => {
  // ** Mutate (Delete) Route in Amplify
  const response = await API.graphql(graphqlOperation(deleteMRoute, {input: {id:route.id}}))
  const routeResult = response.data.deleteMRoute ? response.data.deleteMRoute : null

  if(routeResult) {
    // ** Mutate (Unassign) Driver in Amplify if route is already assigned
    if(routeResult.driverID != '') {
      await API.graphql(graphqlOperation(updateDriver, {input: {id:route.driverID, assignStatus: AssignStatus.UNASSIGNED}}))
    }

    // ** Mutate (Delete) Orders in Amplify the where linked to the route
    for(var i = 0; i < orders.length; i ++) {
      await API.graphql(graphqlOperation(deleteMOrder, {input: {id:orders[i].id}}))
    }

    // ** Mutate (Set Order Subscription to Active) Subscriptions in Amplify the where linked to the route
    for(var i = 0; i < orders.length; i ++) {
      const filter = {
        id: {
          eq: orders[i].subscriptionID
        },
      }
      const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {filter: filter}))
      var subList = []
      if(response.data) {
        subList = response.data.listMpsSubscriptions.items
      }
      for (var k = 0; k < subList.length; k++) {
        await API.graphql(graphqlOperation(updateMpsSubscription, {input: {id:subList[k].id, status: SubscriptionStatus.ACTIVED}}))
      }
    }
  }

  return routeResult
}

export const getGraphHopperRoutes = async (params, getState)  => {
  // ** Create Orders from Active Subscriptions
  const state = getState()
  var orders = await generateOrders(state)

  const rest = 0
  const requestCount = 1
  const ordersInRequest = orders.length
  var currentSpliceIndex = 0
  const finalRoutes = []
  const avaiableDrivers = params.driversCount
  const maxTime = params.maxTime

  const finalSolution = {
    costs: 0,
    totalDistance: 0,
    maxDuration: 0,
    details: [],
    ordersLeft: [],
    result: 'success',
    driversNotAssigned: 0
  }

  var globalRequestAvaiableID = await getAvaiableRouteId()

  const clusterBody = getGraphHopperClusterRequestBody(orders)

  const res = await axios.post('https://graphhopper.com/api/1/cluster?key=110bcab4-47b7-4242-a713-bb7970de2e02', clusterBody)

  console.log('cluster response: ' + JSON.stringify(res))
  if(res.data.clusters.length > 0) {
    const clusters = res.data.clusters
    for(var i = 0; i < clusters.length; i++) {
      var splicedOrders = []
      orders.map(order => {
        if(clusters[i].ids.includes(order.id)) {
          splicedOrders.push(order)
        }
      })
      const ghBody = getGraphHopperRORequestBody(splicedOrders, 1, 99999)
      console.log(JSON.stringify(ghBody))

      try {
        const res = await axios.post('https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)
        
        // ** Request successfuly completed (Process routes and solution)
        const { routes, solution, avaiableID } = getRoutesFromResponse(res, orders, globalRequestAvaiableID)
  
        globalRequestAvaiableID = avaiableID
  
        console.log(JSON.stringify(solution))
        
        finalSolution.costs += solution.costs
        finalSolution.totalDistance += solution.totalDistance
        finalSolution.maxDuration = solution.maxDuration > finalSolution.maxDuration ? solution.maxDuration : finalSolution.maxDuration
        finalSolution.ordersLeft.push(...solution.ordersLeft)
        finalSolution.details.push(...solution.details)
  
        if(finalSolution.details.length > 0) {
          finalSolution.result = 'problem'
        }
        finalRoutes.push(...routes)
      }
      catch(e) { // ** Handle Request Error
        // ** Server error
        if(e.status == 500) {
          const errorMessage = 'GH internal error. Code: ' + e.status
          console.log(errorMessage)
          finalSolution.details.push(e.message)
          splicedOrders.map(order => finalSolution.ordersLeft.push(order.number))
        }
        // ** Error in optimization -> No driver left to make the order
        else {
          const errorMessage = 'Error generating the optimization batch number: ' + (i + 1)
          finalSolution.details.push(errorMessage)
          splicedOrders.map(order => finalSolution.ordersLeft.push(order.number))
        }
        finalSolution.result = 'error'
        break
      }
    }
  }

  // ** Create Optimized Routes from new Orders
  const MAX_ROUTES_PER_REQUEST = 80
  if(orders.length > 80) {
    const dividerFactor = getOptimizedFactor(orders.length, MAX_ROUTES_PER_REQUEST)
    rest = orders.length%dividerFactor
    requestCount = parseInt(orders.length/dividerFactor)
    ordersInRequest = (orders.length - rest) / requestCount
  }

  

  for(var i = 0; i < requestCount; i ++) {
    var ordersCopy = [...orders]
    const splicedOrders = ordersCopy.splice(currentSpliceIndex, ordersInRequest)
    const ghBody = getGraphHopperRORequestBody(splicedOrders, avaiableDrivers, maxTime)

  //   try {
  //     const res = await axios.post('https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)
      
  //     // ** Request successfuly completed (Process routes and solution)
  //     const { routes, solution, avaiableID } = getRoutesFromResponse(res, orders, globalRequestAvaiableID)

  //     globalRequestAvaiableID = avaiableID

  //     console.log(JSON.stringify(solution))
      
  //     avaiableDrivers = avaiableDrivers - routes.length
  //     currentSpliceIndex += ordersInRequest
  //     finalSolution.costs += solution.costs
  //     finalSolution.totalDistance += solution.totalDistance
  //     finalSolution.maxDuration = solution.maxDuration > finalSolution.maxDuration ? solution.maxDuration : finalSolution.maxDuration
  //     finalSolution.ordersLeft.push(...solution.ordersLeft)
  //     finalSolution.details.push(...solution.details)
  //     finalSolution.driversNotAssigned = avaiableDrivers

  //     if(finalSolution.details.length > 0) {
  //       finalSolution.result = 'problem'
  //     }
  //     finalRoutes.push(...routes)
  //   }
  //   catch(e) { // ** Handle Request Error
  //     // ** Server error
  //     if(e.status == 500) {
  //       const errorMessage = 'GH internal error. Code: ' + e.status
  //       console.log(errorMessage)
  //       finalSolution.details.push(e.message)
  //       splicedOrders.map(order => finalSolution.ordersLeft.push(order.number))
  //     }
  //     // ** Error in optimization -> No driver left to make the order
  //     else {
  //       const errorMessage = 'Error generating the optimization batch number: ' + (i + 1)
  //       finalSolution.details.push(errorMessage)
  //       splicedOrders.map(order => finalSolution.ordersLeft.push(order.number))
  //     }
  //     finalSolution.result = 'error'
  //     break
  //   }
   }

  // Send only orders assigned to a route to be saved
  orders = orders.filter(order => order.assignedRouteID != '')

  return { routes: finalRoutes, solution: finalSolution, orders }
}

const getRoutesFromResponse = (response, orders, avaiableID) => {
  const ghRoutes = response.data.solution.routes
  var routes = []
  var ordersLeft = []

  var details = []
  response.data.solution.unassigned.details.map(det => {
    ordersLeft.push(det.id)
    details.push(det.id + ": " + det.reason)
  })

  const solution = {
    costs: response.data.solution.costs,
    totalDistance: response.data.solution.distance,
    maxDuration: response.data.solution.max_operation_time,
    notAssigneds: response.data.solution.no_unassigned,
    details,
    ordersLeft
  }

  var currentIndex = 0

  ghRoutes.map(async route => {
    avaiableID = avaiableID + currentIndex
    var routeID = 'SR' + avaiableID
    
    const deliveries = route.activities.filter(ac => ac.type == 'service')

    for(var k = 0; k < deliveries.length; k++) {
      for(var i = 0; i < orders.length; i++) {
        if(deliveries[k].id === orders[i].id) {
          orders[i].sort = k + 1 // ** Assign the sorted position of the order
          orders[i].assignedRouteID = routeID // ** Assing the order route id
          orders[i].eta = deliveries[k].arr_time // ** Assing the order ETA
        }
      }
    }

    const polyline = []
    for(var i = 0; i < route.points.length - 1; i++){
      polyline.push(...route.points[i].coordinates)
    }

    routes.push(
      {
        id: routeID,
        cost: ((route.completion_time / 60) / 60) * 20,
        startTime: 0,
        endTime: 0,
        status: RouteStatus.PLANNED,
        driverID: '',
        distance: route.distance,
        duration: route.completion_time,
        location: orders[0].location,
        routePlanName: '',
        routeDate: parseFloat(Date.now()),
        points: JSON.stringify(polyline)
      }
    )
    currentIndex += 1
  })
  
  return { routes, solution, avaiableID: avaiableID + 1 }
}

const getAvaiableRouteId = async () => {
  const response = await API.graphql(graphqlOperation(listMRoutes))
  const routesID = []
  response.data.listMRoutes.items.map(route => routesID.push(parseInt(route.id.replace('SR',''))))
  
  const max = Math.max(...routesID)
  return routesID.length > 0 ? max + 1 : 0
}

const getAvaiableOrderId = async () => {
  const response = await API.graphql(graphqlOperation(listMOrders))
  const ordersID = []
  response.data.listMOrders.items.map(order => ordersID.push(parseInt(order.id.replace('#',''))))
  
  const max = Math.max(...ordersID)
  return ordersID.length > 0 ? max + 1 : 0
}

const getOptimizedFactor = (x, y) => {
  var reminder = x % y
  if(reminder < 20)
  {
    return getOptimizedFactor(x, y - 10)
  }
  return y;
}

const getGraphHopperRORequestBody = (orders, maxDrivers, maxTime) => {
  const services = []
  const vehicles = []
  const objectives = [
    {
      "type": "min-max",
      "value": "completion_time"
   },
   {
      "type": "min-max",
      "value": "activities"
   }
  ]

  orders.map(order => {
    services.push({
      id: order.id,
      name: order.number,
      address: {
        location_id: order.id,
        lon: order.longitude,
        lat: order.latitude
      },
      duration: 300
    })
  })

  for(var i = 0; i < maxDrivers; i ++) {
    vehicles.push({
      vehicle_id: 'driver#' + i,
        start_address: {
          location_id: 'Meal Prep Sunday',
          lon: -117.2310085, // ** MPS longitude
          lat: 33.1522247 // ** MPS latitude
        },
        max_jobs:25,
        max_driving_time: maxTime * 60 // ** Receive in minutes and send in seconds
    })
  }

  var body = {
    vehicles,
    services,
    objectives,
    configuration: {
      routing: {
        calc_points: true
      }
    }
  }
  return body
}

const getGraphHopperClusterRequestBody = (orders) => {
  const factor = (orders.length/22) + 2
  const configuration = {
    "response_type": "json",
    "routing": {
      "profile": "as_the_crow_flies",
      "cost_per_second":0,
      "cost_per_meter":1
    },
    "clustering": {
      "num_clusters": factor, 
      "max_quantity": orders.length/factor,
      "min_quantity": 5
    }
  }
  const customers = []

  orders.map(order => {
    customers.push({
      id: order.id,
      address: {
        lon: order.longitude,
        lat: order.latitude,
        street_hint:'teste'
      },
      quantity:1
    })
  })

  var body = {
    configuration,
    customers,
  }
  return body
}

const generateOrders = async (state) => {
  const locationsToProcess = state.routes.locations.filter(loc => loc.included)
  const subscriptionsToProcess = state.routes.subscriptions.filter(sub => {
    var result = false
    for(var i = 0 ; i < locationsToProcess.length; i++) {
      if(locationsToProcess[i].name === sub.location) {
        result = true
        break
      }
    }
     return result
  })

  var orders = []
  var avaiableID = await getAvaiableOrderId()
  var index = 0

  subscriptionsToProcess.map(sub => {
    const id = '#' + (avaiableID + index)
    orders.push({
      id: id,
      number: sub.number,
      deliveryInstruction: sub.deliveryInstruction,
      mealPlan: sub.mealPlan,
      status: OrderStatus.CREATED,
      customerName: sub.name,
      eta: 0,
      sort:0,
      assignedRouteID:'',
      address: sub.address,
      latitude: sub.latitude,
      longitude: sub.longitude,
      orderDate: parseFloat(Date.now()),
      phone: sub.phone,
      location: sub.location,
      subscriptionID: sub.id,
      subscriptionNumber: sub.number,
      avatar:''
    })
    index += 1
  })
  return orders
}

export const fetchRoutes = async (status) => {
  // ** Query Server Routes
  const routesResponse = await API.graphql(graphqlOperation(listMRoutes), {
    limit: 5000
  })
  const routes = routesResponse.data.listMRoutes.items
  const statusFiltered = routes.filter(route => route.status === status)

  return status ? statusFiltered : routes
}

export const fetchOrders = async () => {
  // ** Query Server Orders
  const ordersResponse = await API.graphql(graphqlOperation(listMOrders))
  const orders = ordersResponse.data.listMOrders.items

  return orders
}

export const saveRoutesAndOrders = async (routes, orders, subscriptionsToUpdate) => {
  // ** Mutate Server Orders
  for(var i = 0; i < orders.length; i++) {
    await API.graphql(graphqlOperation(createMOrder, {
      input: orders[i]
    }))
  }
  // ** Mutate Server Routes
  for(var i = 0; i < routes.length; i++) {
    await API.graphql(graphqlOperation(createMRoute, {
      input: routes[i]
    }))
  }

  // ** Mutate Server Subscriptions
  for(var i = 0; i < subscriptionsToUpdate.length; i++) {
    await API.graphql(graphqlOperation(updateMpsSubscription, {
      input: {id: subscriptionsToUpdate[i].id, status:SubscriptionStatus.ASSIGNED}
    }))
  }

  // ** Query Server Routes
  const fetchedRoutes = await fetchRoutes()

  // ** Query Server Orders
  const fetchedOrders = await fetchOrders()

  // ** Query locations and Subscriptions
  const {locations, subscriptions} = await getLocations({q:''})

  return {routes: fetchedRoutes, orders: fetchedOrders, locations, subscriptions};
}