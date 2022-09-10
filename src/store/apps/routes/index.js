// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AssignStatus } from 'src/models';

// ** Repository Imports
import { getLocations, getDrivers, getGraphHopperRoutes, saveRoutesAndOrders, fetchOrders, fetchRoutes, assignAmplifyDriver, unassignAmplifyDriver } from 'src/repository/apps/routes';

// ** Fetch Locations from activeds Subscriptions in the Server
export const fetchLocations = createAsyncThunk('appRoutes/fetchLocations', async (params, { getState })  => {
  const { locations, subscriptions } = await getLocations(params)
  return { locations, subscriptions }
})

// ** Fetch Drivers from Server
export const fetchDrivers = createAsyncThunk('appRoutes/fetchDrivers', async (params)  => {
  const drivers = await getDrivers(params)
  return drivers
})

// ** Generate Optimized Routes
export const generateRoutes = createAsyncThunk('appRoutes/generateRoutes', async (params, { getState }) => {
  const { callback } = params
  const { routes, solution, orders } = await getGraphHopperRoutes(params, getState)
  return { routes, solution, orders, callback }
})

// ** Generate Optimized Routes
export const fetchRoutesAndOrders = createAsyncThunk('appRoutes/fetchRoutesAndOrders', async (params) => {
  
  const {status, dates, q} = params

  const routes = await fetchRoutes(status)
  const orders = await fetchOrders()

  // ** Filter routes to return to Interface
  const queryLowered = q.toLowerCase()

  const filteredData = routes.filter(route => {
    if (dates.length) {
      const [start, end] = dates
      const filtered = []
      const range = getDateRange(start, end)
      const routeDate = new Date(route.routeDate)
      range.filter(date => {
        const rangeDate = new Date(date)
        if (
          routeDate.getFullYear() === rangeDate.getFullYear() &&
          routeDate.getDate() === rangeDate.getDate() &&
          routeDate.getMonth() === rangeDate.getMonth()
        ) {
          filtered.push(route.id)
        }
      })

      if (filtered.length && filtered.includes(route.id)) {
        return (
          (
            route.id.toLowerCase().includes(queryLowered) ||
            route.status.toLowerCase().includes(queryLowered)
          )
        )
      }
    } else {
      return (
        (
          route.id.toLowerCase().includes(queryLowered) ||
          route.status.toLowerCase().includes(queryLowered)
        )
      )
    }
  })


  return { routes: filteredData, orders }
})

// ** Save Generated Routes to Amplify
export const saveRoutes = createAsyncThunk('appRoutes/saveRoutes', async (params, { getState }) => {
  const { callback } = params
  const newRoutes = getState().routes.tempRoutes
  const newOrders = getState().routes.tempOrders

  const ordersID = newOrders.map(order => order.subscriptionID)
  const subscriptionsToUpdate = getState().routes.subscriptions.filter(sub => ordersID.includes(sub.id))

  // ** Save Routes in Amplify
  const { routes, orders, locations, subscriptions } = await saveRoutesAndOrders(newRoutes, newOrders, subscriptionsToUpdate)

  return { routes, orders , locations, subscriptions, callback }
})

// ** Assign Driver to Route
export const assignDriver = createAsyncThunk('appRoutes/assignDriver', async (params) => {
  const { routeID, driverID, callback } = params

  // Assign driver to route in Amplify
  const {route, driver, error} = await assignAmplifyDriver(routeID, driverID)

  return { error, route, driver, driverID, callback }
})

// ** Assign Driver to Route
export const unassignDriver = createAsyncThunk('appRoutes/unassignDriver', async (params) => {
  const { routeID, driverID, callback } = params

  // Unsassign driver to route in Amplify
  const {route, driver, error} = await unassignAmplifyDriver(routeID, driverID)

  return { error, route, driver, driverID, callback }
})

export const appRoutesSlice = createSlice({
  name: 'appRoutes',
  initialState: {
    data: [],
    removeds: [],
    included: [],
    total: 1,
    params: {},
    allData: [],
    locations: [],
    loading: false,
    locations: [],
    selectedLocations: [],
    subscriptions: [],
    drivers: [],
    routes:[],
    tempRoutes:[],
    solution: null,
    tempOrders:[],
    orders:[],
    loadingRoutes: true
  },
  reducers: {
    setLoadingRoutes: (state, action) => {
      state.loadingRoutes = action
    },
    setAssigningDriver: (state, action) => {
      for(var i = 0; i < state.drivers.length; i++) {
        if(state.drivers[i].id === action.payload.driverID) {
          state.drivers[i].assignStatus = AssignStatus.ASSIGNING
        }
      }
    },
    addLocation: (state, action) => {
      var location = action.payload

      // ** Set included to true
      var registeredLocation = state.locations.find(loc => loc.name === location.name)
      var locationIndex = state.locations.indexOf(registeredLocation)
      state.locations[locationIndex].included = true

      // ** Add into selected locations list
      state.selectedLocations.push(location)
    },
    removeLocation: (state, action) => {
      var location = action.payload
      
      // ** Set included to false
      var registeredLocation = state.locations.find(loc => loc.name === location.name)
      var locationIndex = state.locations.indexOf(registeredLocation)
      state.locations[locationIndex].included = false
      
      // ** Remove from selected locations list
      var locationToRemove = state.selectedLocations.find(loc => loc.name === location.name)
      var indexToRemove = state.selectedLocations.indexOf(locationToRemove)
      if(indexToRemove > -1) {
        state.selectedLocations.splice(indexToRemove, 1)
      }
    },
    clearSelectedLocations: (state, action) => {
      state.locations.map(loc => {
        loc.included = false
      })
      state.selectedLocations = []
    },
    clearTempResults: (state, action) => {
      state.tempRoutes = []
      state.solution = []
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchRoutesAndOrders.fulfilled, (state, action) => {
      const sortedRoutes = action.payload.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      state.orders = action.payload.orders
      state.loadingRoutes = false
    })
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.locations = action.payload.locations
      state.subscriptions = action.payload.subscriptions
    })
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      state.drivers = action.payload
    })
    builder.addCase(generateRoutes.fulfilled, (state, action) => {
      state.solution = action.payload.solution
      state.tempRoutes = action.payload.routes
      state.tempOrders = action.payload.orders
      action.payload.callback()
    })
    builder.addCase(saveRoutes.fulfilled, (state, action) => {
      // ** Sort routes by last updated
      const sortedRoutes = action.payload.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      state.orders = action.payload.orders
      state.locations = action.payload.locations
      state.subscriptions = action.payload.subscriptions
      state.locations.map(loc => {
        loc.included = false
      })
      state.selectedLocations = []
      action.payload.callback()
    })
    builder.addCase(assignDriver.fulfilled, (state, action) => {
      const route = action.payload.route
      const driver = action.payload.driver
      const driverID = action.payload.driverID

      //** Assign performed with success
      if(action.payload.error == null) {
        for(var i = 0; i < state.drivers.length; i++) { //** Update driver on local store
          if(state.drivers[i].id === driver.id) {
            state.drivers[i] = driver
          }
        } 
        for(var i = 0; i < state.routes.length; i++) { //** Update route on local store
          if(state.routes[i].id === route.id) {
            state.routes[i] = route
          }
        } 
      }
      else {
        const drivers = state.drivers.filter(dr => dr.id === driverID)
        const driver = drivers[0]
        const index = state.drivers.indexOf(driver)
        state.drivers[index].assignStatus = AssignStatus.UNASSIGNED
      }

      // ** Sort routes by last updated
      const sortedRoutes = state.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      
      //** Return result to interface
      action.payload.callback(action.payload.error)
    })
    builder.addCase(unassignDriver.fulfilled, (state, action) => {
      const route = action.payload.route
      const driver = action.payload.driver
      const driverID = action.payload.driverID

      //** Unassign performed with success
      if(action.payload.error == null) {
        for(var i = 0; i < state.drivers.length; i++) { //** Update driver on local store
          if(state.drivers[i].id === driver.id) {
            state.drivers[i] = driver
          }
        } 
        for(var i = 0; i < state.routes.length; i++) { //** Update route on local store
          if(state.routes[i].id === route.id) {
            state.routes[i] = route
          }
        } 
      }
      else {
        const drivers = state.drivers.filter(dr => dr.id === driverID)
        const driver = drivers[0]
        const index = state.drivers.indexOf(driver)
        state.drivers[index].assignStatus = AssignStatus.ASSIGNED
      }

      // ** Sort routes by last updated
      const sortedRoutes = state.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      
      //** Return result to interface
      action.payload.callback(action.payload.error)
    })
  }
})

export const { addLocation, removeLocation, clearSelectedLocations, clearTempResults, setAssigningDriver, setLoadingRoutes } = appRoutesSlice.actions

export default appRoutesSlice.reducer
