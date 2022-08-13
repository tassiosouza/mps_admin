import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

// ** Axios Imports
import axios from 'axios'
import { Console, CosineWave } from 'mdi-material-ui';

// ** Third Party Imports
import Papa from "papaparse";

// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createMpsSubscription, updateMpsSubscription } from '../../../graphql/mutations'
import { listMpsSubscriptions, getMpsSubscription } from '../../../graphql/queries'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

export const refreshLocations = createAsyncThunk('appRoutes/refreshLocations', async (params)  => {

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
    var found = locations.find(loc => loc.name == locationName)
    if(found) {
      found.deliveries += 1
    }
    else { 
      locations.push({
        name: locationName,
        deliveries: 1
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
    locations:[],
    selectedLocations: []
  },
  reducers: {
    addLocation: (state, action) => {
      console.log('store updated :' + JSON.stringify(action.payload))
      state.selectedLocations.push(action.payload)
    },
    removeLocation: location => {
      const index = array.indexOf(location)
      if (index > -1) {
        selectedLocations.splice(index, 1)
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(refreshLocations.fulfilled, (state, action) => {
      console.log('received in store' + JSON.stringify(action.payload))
      state.locations = action.payload
    })
  }
})

export const { addLocation } = appRoutesSlice.actions

export default appRoutesSlice.reducer
