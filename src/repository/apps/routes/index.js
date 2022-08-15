import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { listMpsSubscriptions } from '../../../graphql/queries'

export const refreshLocations = createAsyncThunk('appRoutes/refreshLocations', async (params, { getState })  => {
  const state = getState()
  const selectedLocations = state.routes.selectedLocations
  var locations = []
  const filter = {
    status: {
      eq: 'Actived'
    }
  }

  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    filter,
    limit: 5000
  }))

  response.data.listMpsSubscriptions.items.map(sub => {
    var locationName = retreiveLocation(sub.address)
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
  return filtered;
})

export const deleteSubscription = createAsyncThunk('appRoutes/deleteData', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/apps/subscriptions/delete', {
    data: id
  })
  await dispatch(fetchData(getState().invoice.params))

  return response.data
})

const retreiveLocation = (address) => {
  const addressComponents =  address.split(',')
  const locationIndex = addressComponents.length - 3
  return addressComponents[locationIndex]
}

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
    selectedLocations: []
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
    builder.addCase(refreshLocations.fulfilled, (state, action) => {
      state.locations = action.payload
    })
  }
})

export const { addLocation, removeLocation, clearSelectedLocations } = appRoutesSlice.actions

export default appRoutesSlice.reducer
