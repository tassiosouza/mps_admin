// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { OrderStatus } from 'src/models'
import {
  listMpsSubscriptions,
  listClusters,
  listDrivers,
  listMRoutes,
  listMOrders,
  getMRoute
} from '../../../graphql/queries'
import {
  createMRoute,
  createMOrder,
  updateMRoute,
  updateDriver,
  deleteMRoute,
  deleteMOrder,
  updateMpsSubscription
} from '../../../graphql/mutations'

// ** Axios Party Imports
import axios from 'axios'

import { RouteStatus } from 'src/models'
import { AssignStatus } from 'src/models'
import { SubscriptionStatus } from 'src/models'

const RESULT_STATUS = {
  SUCCESS: 'SUCESS',
  PARTIAL_FAILED: 'PARTIAL_FAILED',
  FAILED: 'FAILED'
}

const GRAPHHOPPER_ROUTE_LIMIT = 80
const GRAPHHOPPER_CLUSTER_LIMIT = 400
const GRAPHHOPPER_TIME_LIMIT = 60 //seconds

export const getClusters = async params => {
  // ** Query Server Subscriptions
  const response = await API.graphql(
    graphqlOperation(listClusters, {
      limit: 5000
    })
  )

  const clusters = response.data.listClusters.items

  const filtered = clusters.filter(cl => cl.name.toLowerCase().includes(params.q.toLowerCase()))
  return { clusters: filtered }
}

export const getSubscriptions = async () => {
  const filter = {
    status: {
      eq: SubscriptionStatus.ACTIVED
    }
  }
  // ** Query Server Subscriptions
  const response = await API.graphql(
    graphqlOperation(listMpsSubscriptions, {
      filter,
      limit: 5000
    })
  )
  const subscriptions = response.data.listMpsSubscriptions.items

  return { subscriptions }
}

export const getDrivers = async params => {
  // ** Query Server Drivers
  const response = await API.graphql(
    graphqlOperation(listDrivers, {
      limit: 5000
    })
  )

  const filteredDrivers = response.data.listDrivers.items.filter(driver => {
    return driver.name.toLowerCase().includes(params.query.toLowerCase())
  })

  return filteredDrivers
}

export const assignAmplifyDriver = async (routeID, driverID) => {
  // ** Query Route to be Assigned
  const qResponse = await API.graphql(graphqlOperation(getMRoute, { id: routeID }))
  const route = qResponse.data.getMRoute ? qResponse.data.getMRoute : null
  if (route != null) {
    if (route.driverID != '') {
      return { route: null, error: 'Route already assigned', driver: null }
    } else {
      // ** Assign driver to the route in Amplify
      const routeToUpdate = {
        id: route.id,
        driverID: driverID,
        status: RouteStatus.ASSIGNED
      }
      const driverToUpdate = {
        id: driverID,
        assignStatus: AssignStatus.ASSIGNED
      }
      const updatedRoute = await (
        await API.graphql(graphqlOperation(updateMRoute, { input: routeToUpdate }))
      ).data.updateMRoute
      const updatedDriver = await (
        await API.graphql(graphqlOperation(updateDriver, { input: driverToUpdate }))
      ).data.updateDriver

      return { route: updatedRoute, error: null, driver: updatedDriver }
    }
  } else {
    return {
      error: 'Invalid route id'
    }
  }
}

export const unassignAmplifyDriver = async (routeID, driverID) => {
  // ** Query Route to be Unassigned
  const qResponse = await API.graphql(graphqlOperation(getMRoute, { id: routeID }))
  const route = qResponse.data.getMRoute ? qResponse.data.getMRoute : null
  if (route != null) {
    if (route.driverID == '') {
      return { route: null, error: 'Route already unassigned', driver: null }
    }
    if (route.status != RouteStatus.ASSIGNED) {
      return { route: null, error: 'This route can not be unassigned', driver: null }
    } else {
      // ** Unassign driver to the route in Amplify
      const routeToUpdate = {
        id: route.id,
        driverID: '',
        status: RouteStatus.PLANNED
      }
      const driverToUpdate = {
        id: driverID,
        assignStatus: AssignStatus.UNASSIGNED
      }
      const updatedRoute = await (
        await API.graphql(graphqlOperation(updateMRoute, { input: routeToUpdate }))
      ).data.updateMRoute
      const updatedDriver = await (
        await API.graphql(graphqlOperation(updateDriver, { input: driverToUpdate }))
      ).data.updateDriver

      return { route: updatedRoute, error: null, driver: updatedDriver }
    }
  } else {
    return {
      error: 'Could not find a route to unassign'
    }
  }
}

export const deleteRoutes = async (routes, orders) => {
  const routeResult = false
  for (var j = 0; j < routes.length; j++) {
    // ** Mutate (Delete) Route in Amplify
    const response = await API.graphql(graphqlOperation(deleteMRoute, { input: { id: routes[j].id } }))
    routeResult = response.data.deleteMRoute ? response.data.deleteMRoute : null

    if (routeResult) {
      // ** Mutate (Unassign) Driver in Amplify if route is already assigned
      if (routeResult.driverID != '') {
        await API.graphql(
          graphqlOperation(updateDriver, { input: { id: routes[j].driverID, assignStatus: AssignStatus.UNASSIGNED } })
        )
      }

      // ** Mutate (Delete) Orders in Amplify the where linked to the route
      for (var i = 0; i < orders.length; i++) {
        await API.graphql(graphqlOperation(deleteMOrder, { input: { id: orders[i].id } }))
      }

      // ** Mutate (Set Order Subscription to Active) Subscriptions in Amplify the where linked to the route
      // for(var i = 0; i < orders.length; i ++) {
      //   const filter = {
      //     id: {
      //       eq: orders[i].subscriptionID
      //     },
      //   }
      //   const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {filter: filter}))
      //   var subList = []
      //   if(response.data) {
      //     subList = response.data.listMpsSubscriptions.items
      //   }
      //   for (var k = 0; k < subList.length; k++) {
      //     await API.graphql(graphqlOperation(updateMpsSubscription, {input: {id:subList[k].id, status: SubscriptionStatus.ACTIVED}}))
      //   }
      // }
    }
  }

  return routeResult
}

// ** Process Route Generation Based on Selected Algorithm
export const getGraphHopperRoutes = async params => {
  const { parameters, subscriptions, clusters } = params

  var finalRoutes = []
  var finalOrders = []
  var finalSolution = {
    costs: 0,
    totalDistance: 0,
    maxDuration: 0,
    details: [],
    ordersLeft: [],
    result: 'success',
    driversNotAssigned: 0
  }

  for (var i = 0; i < clusters.length; i++) {
    const subscriptionsToProcess = subscriptions.filter(sub => sub.clusterId === clusters[i].id)
    const ordersToProcess = await generateOrders(subscriptionsToProcess)
    const { routes, orders, result } = await processGraphHopperOptimizedRoutes(parameters, ordersToProcess, clusters[i])
    switch (result.status) {
      case RESULT_STATUS.SUCCESS:
        //Process here
        finalRoutes.push(...routes)
        finalOrders.push(...orders)
        break
      default:
        break
    }
  }

  return { routes: finalRoutes, solution: finalSolution, orders: finalOrders }
}

const processGraphHopperOptimizedRoutes = async (parameters, orders, cluster) => {
  var globalRequestAvaiableID = await getAvaiableRouteId()
  var result = { status: RESULT_STATUS.SUCCESS, errors: [] }
  var clusterRoutes = []

  // ** Return error if cluster has more than 400 locations
  if (orders.length > GRAPHHOPPER_CLUSTER_LIMIT) {
    result = {
      status: RESULT_STATUS.FAILED,
      errors: ['The Cluster ' + cluster.name + ' has more than 400 subscriptions']
    }

    return { routes: [], orders: [], result: result }
  }

  // ** Cluster locations if the number of orders exceds the route optimization locations limit
  if (orders.length > GRAPHHOPPER_ROUTE_LIMIT) {
    const ghBody = getFixedGraphHopperClusterRequestBody(orders)
    const response = await axios.post(
      'https://graphhopper.com/api/1/cluster?key=110bcab4-47b7-4242-a713-bb7970de2e02',
      ghBody
    )

    console.log('slepping...')
    await new Promise(r => setTimeout(r, 60000))
    console.log('continue...')

    if (response.data) {
      const clustersResult = response.data.clusters
      for (var i = 0; i < clustersResult.length; i++) {
        const insideClusterOrders = orders.filter(order => clustersResult[i].ids.includes(order.id))
        // ** Clusters here are the final clusters result for the initial division and shall be converted to routes
        var ghRouteBody = getGraphHopperRORequestBody(insideClusterOrders, parameters, clustersResult.length)

        console.log('slepping for vpr...')
        await new Promise(r => setTimeout(r, 5 * insideClusterOrders.length * 150))
        console.log('continue...')

        const response = await axios.post(
          'https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02',
          ghRouteBody
        )
        console.log('body: ' + JSON.stringify(ghRouteBody))

        if (response.data?.solution?.unassigned?.services?.length > 0) {
          result = { status: RESULT_STATUS.PARTIAL_FAILED, errors: response.solution.unassigned.services.details }
          return { routes: [], orders: [], result: result }
        } else {
          if (response.data.solution) {
            console.log('response: ' + JSON.stringify(response.data.solution))
            const { routes, solution, avaiableID } = getRoutesFromResponse(
              response,
              insideClusterOrders,
              globalRequestAvaiableID,
              cluster.id
            )
            clusterRoutes = [...clusterRoutes, ...routes]
            globalRequestAvaiableID = avaiableID
          } else {
            result = { status: RESULT_STATUS.PARTIAL_FAILED, errors: [JSON.stringify(response)] }
            return { routes: [], orders: [], result: result }
          }
        }
      }
    }
  } else {
    // ** Clusters here are the final clusters result for the initial division and shall be converted to routes
    var ghRouteBody = getGraphHopperRORequestBody(orders, parameters, 1)
    const response = await axios.post(
      'https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02',
      ghRouteBody
    )
    console.log('body: ' + JSON.stringify(ghRouteBody))
    if (response.data?.solution?.unassigned?.services?.length > 0) {
      result = { status: RESULT_STATUS.PARTIAL_FAILED, errors: response.solution.unassigned.services.details }
      return { routes: [], orders: [], result: result }
    } else {
      if (response.data.solution) {
        console.log('response: ' + JSON.stringify(response.data.solution))
        const { routes, solution, avaiableID } = getRoutesFromResponse(
          response,
          orders,
          globalRequestAvaiableID,
          cluster.id
        )
        clusterRoutes = [...clusterRoutes, ...routes]
        globalRequestAvaiableID = avaiableID
      } else {
        result = { status: RESULT_STATUS.PARTIAL_FAILED, errors: [JSON.stringify(response)] }
        return { routes: [], orders: [], result: result }
      }
    }
  }
  return { routes: clusterRoutes, orders, result: result }
}

const getRoutesFromResponse = (response, orders, avaiableID, clusterId) => {
  const ghRoutes = response.data.solution.routes
  var routes = []
  var ordersLeft = []
  var finalAvaiableId = avaiableID

  var details = []
  response.data.solution.unassigned.details.map(det => {
    ordersLeft.push(det.id)
    details.push(det.id + ': ' + det.reason)
  })

  const solution = {
    costs: response.data.solution.costs,
    totalDistance: response.data.solution.distance,
    maxDuration: response.data.solution.max_operation_time,
    notAssigneds: response.data.solution.no_unassigned,
    details,
    ordersLeft
  }

  ghRoutes.map(async route => {
    var routeID = 'SR' + finalAvaiableId
    console.log('route activies: ' + JSON.stringify(route.activities))
    const deliveries = route.activities.filter(ac => ac.type === 'service')
    var index = 1
    for (var i = 0; i < orders.length; i++) {
      var found = deliveries.find(del => orders[i].id === del.id)
      console.log('found: ' + JSON.stringify(found))
      if (found) {
        orders[i].sort = deliveries.indexOf(found) + 1 // ** Assign the sorted position of the order
        orders[i].assignedRouteID = routeID // ** Assing the order route id
        orders[i].eta = found.arr_time // ** Assing the order ETA
        orders[i].clusterId = clusterId
      }
    }

    const polyline = []
    for (var i = 0; i < route.points.length; i++) {
      polyline.push(...route.points[i].coordinates)
    }

    routes.push({
      id: routeID,
      cost: (route.completion_time / 60 / 60) * 20,
      startTime: 0,
      endTime: 0,
      status: RouteStatus.PLANNED,
      driverID: '',
      distance: route.distance,
      duration: route.completion_time,
      clusterId: clusterId,
      routePlanName: '',
      routeDate: parseFloat(Date.now()),
      points: JSON.stringify(polyline)
    })
    finalAvaiableId += 1
  })

  return { routes, solution, avaiableID: finalAvaiableId + 1 }
}

const getAvaiableRouteId = async () => {
  const response = await API.graphql(graphqlOperation(listMRoutes))
  const routesID = []
  response.data.listMRoutes.items.map(route => routesID.push(parseInt(route.id.replace('SR', ''))))

  const max = Math.max(...routesID)
  return routesID.length > 0 ? max + 1 : 0
}

const getAvaiableOrderId = async () => {
  const response = await API.graphql(
    graphqlOperation(listMOrders, {
      limit: 5000
    })
  )
  const ordersID = []
  response.data.listMOrders.items.map(order => ordersID.push(parseInt(order.id.replace('#', ''))))
  console.log('itens returned: ' + JSON.stringify(response.data.listMOrders.items))
  const max = Math.max(...ordersID)
  console.log('max: ' + max)
  return ordersID.length > 0 ? max + 1 : 0
}

const getOptimizedFactor = (x, y) => {
  var reminder = x % y
  if (reminder < 20) {
    return getOptimizedFactor(x, y - 10)
  }
  return y
}

const getGraphHopperRORequestBody = (orders, parameters, factor) => {
  const routesCount = parameters.paramMaxRoutes / factor
  const services = []
  const vehicles = []

  orders.map(order => {
    console.log(order.id)
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

  for (var i = 0; i < routesCount; i++) {
    vehicles.push({
      vehicle_id: 'driver#' + i,
      start_address: {
        location_id: 'Meal Prep Sunday',
        lon: -117.227969, // ** MPS longitude
        lat: 33.152428 // ** MPS latitude
      },
      max_jobs: parameters.paramMaxBags,
      min_jobs: parameters.paramMinBags,
      end_address: {
        location_id: 'end',
        lon: -117.161087,
        lat: 32.7105867,
        name: 'home end'
      }
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

const getFixedGraphHopperClusterRequestBody = orders => {
  const factor = orders.length % 80 == 0 ? orders.length / 80 : orders.length / 80 + 1
  const configuration = {
    response_type: 'json',
    routing: {
      profile: 'as_the_crow_flies',
      cost_per_second: 0,
      cost_per_meter: 1
    },
    clustering: {
      num_clusters: factor,
      min_quantity: orders.length / factor
    }
  }
  const customers = []

  orders.map(order => {
    customers.push({
      id: order.id,
      address: {
        lon: order.longitude,
        lat: order.latitude,
        street_hint: order.address
      },
      quantity: 1
    })
  })

  var body = {
    configuration,
    customers
  }
  return body
}

const generateOrders = async subscriptions => {
  var orders = []
  var avaiableID = await getAvaiableOrderId()
  console.log('avaiable id = ' + avaiableID)
  var index = 0

  subscriptions.map(sub => {
    const id = '#' + (avaiableID + index)
    orders.push({
      id: id,
      number: sub.number,
      deliveryInstruction: sub.deliveryInstruction,
      mealPlan: sub.mealPlan,
      status: OrderStatus.CREATED,
      customerName: sub.name,
      eta: 0,
      sort: 0,
      assignedRouteID: '',
      address: sub.address,
      latitude: sub.latitude,
      longitude: sub.longitude,
      orderDate: parseFloat(Date.now()),
      phone: sub.phone,
      subscriptionID: sub.id,
      subscriptionNumber: sub.number,
      avatar: ''
    })
    index += 1
  })
  return orders
}

export const fetchRoutes = async status => {
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
  const response = await API.graphql(
    graphqlOperation(listMOrders, {
      limit: 5000
    })
  )
  const orders = response.data.listMOrders.items

  return orders
}

export const saveRoutesAndOrders = async (routes, orders, subscriptionsToUpdate) => {
  // ** Mutate Server Orders
  for (var i = 0; i < orders.length; i++) {
    await API.graphql(
      graphqlOperation(createMOrder, {
        input: orders[i]
      })
    )
  }
  // ** Mutate Server Routes
  for (var i = 0; i < routes.length; i++) {
    await API.graphql(
      graphqlOperation(createMRoute, {
        input: routes[i]
      })
    )
  }

  // ** Mutate Server Subscriptions
  // for(var i = 0; i < subscriptionsToUpdate.length; i++) {
  //   await API.graphql(graphqlOperation(updateMpsSubscription, {
  //     input: {id: subscriptionsToUpdate[i].id, status:SubscriptionStatus.ASSIGNED}
  //   }))
  // }

  // ** Query Server Routes
  const fetchedRoutes = await fetchRoutes()

  // ** Query Server Orders
  const fetchedOrders = await fetchOrders()

  // ** Query locations and Subscriptions
  const { subscriptions } = await getSubscriptions()

  return { routes: fetchedRoutes, orders: fetchedOrders, subscriptions }
}
