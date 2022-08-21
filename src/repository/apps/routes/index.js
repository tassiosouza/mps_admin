// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { OrderStatus } from 'src/models'
import { listMpsSubscriptions, listDrivers } from '../../../graphql/queries'

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
  const routes = []

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
    const ghBody = getGraphHopperRequestBody(splicedOrders, params.driversCount)

    const res = await axios.post('https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)

    routes.push(...getRoutesFromResponse(res, orders))

    currentSpliceIndex += ordersInRequest
  }
  
  return routes
}

const getRoutesFromResponse = (response, orders) => {
  var routes = []
  const ghRoutes = response.data.solution.routes

  ghRoutes.map(route => {
    var routeOrders = []
    var routeID = 'R' + parseFloat(Date.now()).toString()
    const deliveries = route.activities.filter(ac => ac.type == 'service')

    for(var k = 0; k < deliveries.length; k++) {
      for(var i = 0; i < orders.length; i++) {
        if(deliveries[k].id === orders[i].id) {
          orders[i].sort = k // ** Assign the sorted position of the order
          orders[i].routeID = routeID // ** Assing the order route id
          orders[i].eta = deliveries[k].arr_time // ** Assing the order ETA
          routeOrders.push(orders[i]) // ** Assing the processed order to route order list
        }
      }
    }

    routes.push(
      {
        id: routeID,
        cost: 0,
        startTime: 0,
        endTime: 0,
        status: RouteStatus.PLANNED,
        name: 'R' + parseFloat(Date.now()).toString(),
        orders: routeOrders,
        driver: null,
        distance: route.distance,
        duration: route.completion_time,
        location: routeOrders[0].location,
        routePlanName: '',
        routeDate: parseFloat(Date.now()),
        points: route.points
      }
      
    )
  })
  return routes
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
    routeID:'',
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