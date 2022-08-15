// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getLocations, getDrivers } from 'src/repository/apps/routes';

// ** Fetch Locations from activeds Subscriptions in the Server
export const fetchLocations = createAsyncThunk('appRoutes/fetchLocations', async (params, { getState })  => {
  const locations = await getLocations(params, getState)
  return locations
})

// ** Fetch Drivers from Server
export const fetchDrivers = createAsyncThunk('appRoutes/fetchDrivers', async (params, { getState })  => {
  const drivers = await getLocations(params, getState)
  return drivers
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
    drivers: []
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
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.locations = action.payload
    })
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      state.drivers = action.payload
    })
  }
})

export const { addLocation, removeLocation, clearSelectedLocations } = appRoutesSlice.actions

export default appRoutesSlice.reducer
