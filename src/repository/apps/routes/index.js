// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { TruckDelivery } from 'mdi-material-ui'
import { OrderStatus } from 'src/models'
import { MOrder } from 'src/models'
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
    console.log(requestCount + ' requests of ' + ordersInRequest + ' + 1 request of: ' + rest)
  }

  for(var i = 0; i < requestCount; i ++) {
    const splicedOrders = orders.splice(currentSpliceIndex, ordersInRequest)
    const ghBody = getGraphHopperRequestBody(splicedOrders, params.driversCount)

    // console.log(JSON.stringify(ghBody))
    const res = await axios.post('https://graphhopper.com/api/1/vrp?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)

    routes.push(...getRoutesFromResponse(res))

    currentSpliceIndex += ordersInRequest
  }
  
  return routes
}

const getRoutesFromResponse = response => {
  var routes = []
  const ghRoutes = response.data.solution.routes
  console.log(JSON.stringify(response.data.solution.routes))

  ghRoutes.map(route => {
    console.log(JSON.stringify(route))
    routes.push(
      {
        id: 'R' + parseFloat(Date.now()).toString(),
        cost: 0,
        startTime: 0,
        endTime: 0,
        status: RouteStatus.PLANNED,
        name: 'R' + parseFloat(Date.now()).toString(),
        orders: [],
        driver: null,
        distance: route.distance,
        duration: route.completion_time,
        location: '',
        routePlanName: ''
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
        max_driving_time: 18000 // ** Fixed max driver in transit duration: 5 hours
    })
  }

  var body = {
    vehicles,
    services
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