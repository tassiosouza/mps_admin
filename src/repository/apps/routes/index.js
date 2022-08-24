// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { OrderStatus } from 'src/models'
import { listMpsSubscriptions, listDrivers, listMRoutes, listMOrders } from '../../../graphql/queries'
import { createMRoute, createMOrder } from '../../../graphql/mutations'

// ** Axios Party Imports
import axios from 'axios'
import { RouteStatus } from 'src/models'

export const getLocations = async (params, getState)  => {
  const state = getState()
  const selectedLocations = state.routes.selectedLocations
  var locations = []
  const filter = {
    status: {
      eq: 'Actived'
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
      var selectedLocation = selectedLocations.find(loc => loc.name === locationName)
      locations.push({
        name: locationName,
        deliveries: 1,
        included: selectedLocation != null
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

export const getGraphHopperRoutes = async (params, getState )  => {
  // ** Create Orders from Active Subscriptions
  const state = getState()
  var orders = generateOrders(state)

  const rest = 0
  const requestCount = 1
  const ordersInRequest = orders.length
  var currentSpliceIndex = 0
  const finalRoutes = []
  const avaiableDrivers = params.driversCount

  const finalSolution = {
    costs: 0,
    totalDistance: 0,
    maxDuration: 0,
    notAssigneds: 0,
    details: [],
    ordersLeft: [],
    result: 'success'
  }

  // ** Create Optimized Routes from new Orders
  const MAX_ROUTES_PER_REQUEST = 80
  if(orders.length > 80) {
    const dividerFactor = getOptimizedFactor(orders.length, MAX_ROUTES_PER_REQUEST)
    rest = orders.length%dividerFactor
    requestCount = parseInt(orders.length/dividerFactor)
    ordersInRequest = (orders.length - rest) / requestCount
  }

  var globalRequestAvaiableID = await getAvaiableRouteId()

  for(var i = 0; i < requestCount; i ++) {
    var ordersCopy = [...orders]
    const splicedOrders = ordersCopy.splice(currentSpliceIndex, ordersInRequest)
    const ghBody = getGraphHopperRequestBody(splicedOrders, avaiableDrivers)

    try {
      const res = await axios.post('https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)
      
      // ** Request successfuly completed (Process routes and solution)
      const { routes, solution, avaiableID } = getRoutesFromResponse(res, orders, globalRequestAvaiableID)

      globalRequestAvaiableID = avaiableID
      
      avaiableDrivers = solution.notAssigneds
      currentSpliceIndex += ordersInRequest
      finalSolution.costs += solution.costs
      finalSolution.totalDistance += solution.totalDistance
      finalSolution.maxDuration += solution.maxDuration
      finalSolution.notAssigneds += solution.notAssigneds
      finalSolution.ordersLeft.push(...solution.ordersLeft)
      finalSolution.details.push(...solution.details)
      finalSolution.notAssigneds = avaiableDrivers

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

  console.log('FINAL ROUTES FROM GRAPHHOOPER: ' + JSON.stringify(finalRoutes))

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
    var routeID = 'R' + avaiableID
    
    const deliveries = route.activities.filter(ac => ac.type == 'service')

    for(var k = 0; k < deliveries.length; k++) {
      for(var i = 0; i < orders.length; i++) {
        if(deliveries[k].id === orders[i].id) {
          orders[i].sort = k // ** Assign the sorted position of the order
          orders[i].assignedRouteID = routeID // ** Assing the order route id
          orders[i].eta = deliveries[k].arr_time // ** Assing the order ETA
        }
      }
    }

    console.log('points: ' + JSON.stringify(route.points))

    const polyline = []
    var indexx = 0
    route.points.map(point => {
      if(indexx > 0 && indexx < route.points.length -2)
      polyline.push(...point.coordinates)
      indexx += 1
    })

    console.log('pushing points: ' + JSON.stringify(polyline))

    routes.push(
      {
        id: routeID,
        cost: 0,
        startTime: 0,
        endTime: 0,
        status: RouteStatus.ASSIGNED,
        driverID: 'a1316a98-6e9c-432d-b916-59ab2d1cf952',
        distance: route.distance,
        duration: route.completion_time,
        location: '',
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
  response.data.listMRoutes.items.map(route => routesID.push(parseInt(route.id.replace('R',''))))
  
  const max = Math.max(...routesID)
  return routesID.length > 0 ? max + 1 : 0
}

const getOptimizedFactor = (x, y) => {
  var reminder = x % y
  if(reminder < 20)
  {
    return getOptimizedFactor(x, y - 10)
  }
  return y;
}

const getGraphHopperRequestBody = (orders, maxDrivers) => {
  const services = []
  const vehicles = []

  orders.map(order => {
    services.push({
      id: order.id,
      name: order.number,
      address: {
        location_id: order.id,
        lon: order.longitude,
        lat: order.latitude
      }
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
        max_driving_time: 15000 // ** Fixed max driver in transit duration: 2hours and 30min
    })
  }

  var body = {
    vehicles,
    services,
    configuration: {
      routing: {
        calc_points: true
      }
    }
  }
  return body
}

const generateOrders = state => {
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
  subscriptionsToProcess.map(sub => {
    orders.push({id: sub.id + '-' + parseFloat(Date.now()).toString(),
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
    location: sub.location
    })
  })
  return orders
}

export const fetchRoutes = async () => {
  // ** Query Server Routes
  console.log('quering')
  const routesResponse = await API.graphql(graphqlOperation(listMRoutes))
  console.log('response: ' + JSON.stringify(routesResponse))
  const routes = routesResponse.data.listMRoutes.items

  return routes
}

export const fetchOrders = async () => {
  // ** Query Server Orders
  const ordersResponse = await API.graphql(graphqlOperation(listMOrders))
  const orders = ordersResponse.data.listMOrders.items

  return orders
}

export const saveRoutesAndOrders = async (routes, orders) => {
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

  // ** Query Server Routes
  const fetchedRoutes = await fetchRoutes()

  // ** Query Server Orders
  const fetchedOrders = await fetchOrders()

  return {routes: fetchedRoutes, orders: fetchedOrders};
}