// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AssignStatus } from 'src/models';

// ** Repository Imports
import { getLocations, getDrivers, getGraphHopperRoutes, saveRoutesAndOrders, fetchOrders, fetchRoutes, assignAmplifyDriver } from 'src/repository/apps/routes';

// ** Fetch Locations from activeds Subscriptions in the Server
export const fetchLocations = createAsyncThunk('appRoutes/fetchLocations', async (params, { getState })  => {
  const { locations, subscriptions } = await getLocations(params, getState)
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
export const fetchRoutesAndOrders = createAsyncThunk('appRoutes/fetchRoutesAndOrders', async (params, { getState }) => {
  const routes = await fetchRoutes()
  const orders = await fetchOrders()
  return { routes, orders }
})

// ** Save Generated Routes to Amplify
export const saveRoutes = createAsyncThunk('appRoutes/saveRoutes', async (params, { getState }) => {
  const { callback } = params
  const newRoutes = getState().routes.tempRoutes
  const newOrders = getState().routes.tempOrders

  // ** Save Routes in Amplify
  const { routes, orders } = await saveRoutesAndOrders(newRoutes, newOrders)

  return { routes, orders , callback }
})

// ** Assign Driver to Route
export const assignDriver = createAsyncThunk('appRoutes/assignDriver', async (params) => {
  const { routeID, driverID, callback } = params

  // Assign driver to route in Amplify
  const {route, driver, error} = await assignAmplifyDriver(routeID, driverID)

  return { error, route, driver, callback }
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
      state.routes = action.payload.routes
      state.orders = action.payload.orders
      state.loadingRoutes = false
    })
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.locations = action.payload.locations
      state.subscriptions = action.payload.subscriptions
    })
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      console.log(JSON.stringify(action.payload))
      state.drivers = action.payload
    })
    builder.addCase(generateRoutes.fulfilled, (state, action) => {
      state.solution = action.payload.solution
      state.tempRoutes = action.payload.routes
      state.tempOrders = action.payload.orders
      action.payload.callback()
    })
    builder.addCase(saveRoutes.fulfilled, (state, action) => {
      state.routes = action.payload.routes
      state.orders = action.payload.orders
      action.payload.callback()
    })
    builder.addCase(assignDriver.fulfilled, (state, action) => {
      const route = action.payload.route
      const driver = action.payload.driver

      console.log('store result: ' + JSON.stringify(action.payload))

      //** Assign performed with success
      if(action.payload.error == null) {
        for(var i = 0; i < state.drivers.length; i++) { //** Update driver on local store
          if(state.drivers[i].id === driver.id) {
            console.log('updating driver to: ' + JSON.stringify(driver))
            state.drivers[i] = driver
          }
        } 
        for(var i = 0; i < state.routes.length; i++) { //** Update route on local store
          if(state.routes[i].id === route.id) {
            console.log('updating route to: ' + JSON.stringify(route))
            state.routes[i] = route
          }
        } 
      }
      
      //** Return result to interface
      action.payload.callback(action.payload.error)
    })
  }
})

export const { addLocation, removeLocation, clearSelectedLocations, clearTempResults, setAssigningDriver } = appRoutesSlice.actions

export default appRoutesSlice.reducer
