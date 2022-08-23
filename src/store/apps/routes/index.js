// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getLocations, getDrivers, getGraphHopperRoutes, saveAmplifyRoutes } from 'src/repository/apps/routes';

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
  const { routes, solution } = await getGraphHopperRoutes(params, getState)
  return { routes, solution, callback }
})

// ** Save Generated Routes to Amplify
export const saveRoutes = createAsyncThunk('appRoutes/saveRoutes', async (params, { getState }) => {
  const { callback } = params
  const newRoutes = getState().routes.tempRoutes

  // ** Save Routes in Amplify
  await saveAmplifyRoutes(newRoutes)

  console.log('finish saving in store')

  return { routes:[] , callback }
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
    solution: null
  },
  reducers: {
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
      action.payload.callback()
    })
    builder.addCase(saveRoutes.fulfilled, (state, action) => {
      state.routes = action.payload.routes
      action.payload.callback()
    })
  }
})

export const { addLocation, removeLocation, clearSelectedLocations, clearTempResults } = appRoutesSlice.actions

export default appRoutesSlice.reducer
