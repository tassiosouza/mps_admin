// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getClusters } from 'src/repository/apps/routes'

// ** Repository Imports
import { getSubscriptions, loadSubscriptions } from 'src/repository/apps/subscriptions'

// ** Fetch Subscriptions from Server
export const fetchSubscriptions = createAsyncThunk('appSubscriptions/fetchData', async params => {
  const subscriptions = await getSubscriptions(params)
  const clusters = await getClusters({ q: '' })
  return { subscriptions, clusters }
})

// ** Load Subscriptions from File
export const loadSubscriptionsFromFile = createAsyncThunk('appSubscriptions/loadData', async (params, { getState }) => {
  const subscriptionsFromFile = await loadSubscriptions(params, getState)

  return subscriptionsFromFile
})

export const appSubscriptionSlice = createSlice({
  name: 'appSubscriptions',
  initialState: {
    data: [],
    params: {},
    locations: [],
    loading: false,
    clusters: []
  },
  reducers: {
    handleLoadingSubscriptions: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      // ** Retreive Locations from fetched
      for (var i = 0; i < action.payload.subscriptions.length; i++) {
        const location = action.payload.subscriptions[i].location
        if (!state.locations.includes(location)) {
          state.locations.push(location)
        }
      }
      const subsToRefreshSorted = action.payload.subscriptions.sort(
        (a, b) => parseFloat(a.subscriptionDate) - parseFloat(b.subscriptionDate)
      )
      state.data = subsToRefreshSorted

      // ** Format and Update Clusters
      state.clusters = action.payload.clusters.clusters.map(cl => {
        return { ...cl, hover: false, path: JSON.parse(cl.path) }
      })

      state.loading = false
    })
    builder.addCase(loadSubscriptionsFromFile.fulfilled, (state, action) => {
      var { synced, toUpdate, included, params, canceled, callback, errorMessage } = action.payload
      state.loading = false
      state.params = params

      // ** If sync with file was sucessfully
      if (errorMessage === '') {
        for (var i = 0; i < toUpdate.length; i++) {
          for (var k = 0; k < synced.length; k++) {
            var indexToUpdate = synced.indexOf(toUpdate[i])
            synced[indexToUpdate] = toUpdate[i]
          }
        }

        // ** Concat updated subscriptions with news and canceled
        const finalSubscriptionList = synced.concat(included, canceled)
        state.data = finalSubscriptionList
        state.params = action.payload.params
        state.allData = action.payload

        callback(false, 'Subscriptions successfully synced  🎉')
      } else {
        callback(true, errorMessage)
      }
    })
  }
})

export const { handleLoadingSubscriptions } = appSubscriptionSlice.actions

export default appSubscriptionSlice.reducer
