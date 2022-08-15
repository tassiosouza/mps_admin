import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getSubscriptions, loadSubscriptions } from 'src/repository/apps/subscriptions';

export const appSubscriptionSlice = createSlice({
  name: 'appSubscriptions',
  initialState: {
    data: [],
    params: {},
    locations: [],
    loading: false,
  },
  reducers: {
    handleLoadingSubscriptions: (state, action) => {
      state.loading = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {

      // ** Retreive Locations from fetched
      for(var i = 0; i < action.payload.length; i++) {
        const location = retreiveLocation(action.payload[i].address)
        if(!state.locations.includes(location)) {
          state.locations.push(location)
        }
      }
      const subsToRefreshSorted = action.payload.sort((a, b) => parseFloat(a.subscriptionDate) - parseFloat(b.subscriptionDate))
      state.data = subsToRefreshSorted
      state.params = action.payload.params
      state.loading = false
    })
    builder.addCase(loadSubscriptionsFromFile.fulfilled, (state, action) => {
      var { synced, toUpdate, included, params, canceled, callback, errorMessage} = action.payload
      state.loading = false
      state.params = params

      // ** If sync with file was sucessfully
      if(errorMessage === '') {
        for(var i = 0; i < toUpdate.length; i ++) {
          for(var k = 0; k < synced.length; k ++) {
            var indexToUpdate = synced.indexOf(toUpdate[i])
            synced[indexToUpdate] = toUpdate[i]
          }
        }
        
        // ** Concat updated subscriptions with news and canceled
        const finalSubscriptionList = synced.concat(included, canceled)
        state.data = finalSubscriptionList
        state.params = action.payload.params
        state.allData = action.payload

        callback(false, "Subscriptions successfully synced  🎉")

      }
      else {
        callback(true, errorMessage)
      }
    })
  }
})

// ** Local function to retreive locations
const retreiveLocation = (address) => {
  const addressComponents =  address.split(',')
  const locationIndex = addressComponents.length - 3
  return addressComponents[locationIndex]
}

// ** Fetch Subscriptions from Server
export const fetchSubscriptions = createAsyncThunk('appSubscriptions/fetchData', async (params)  => {
  const subscriptions = await getSubscriptions(params)

  return subscriptions
})

// ** Load Subscriptions from File
export const loadSubscriptionsFromFile = createAsyncThunk('appSubscriptions/loadData', async (params, { getState })  => {
  
  const subscriptionsFromFile = await loadSubscriptions(params, getState)

  return subscriptionsFromFile
})

export const { handleLoadingSubscriptions } = appSubscriptionSlice.actions

export default appSubscriptionSlice.reducer
