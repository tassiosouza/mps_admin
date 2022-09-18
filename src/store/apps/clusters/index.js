// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions } from 'src/repository/apps/clusters'


// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    clusters: [],
    subscriptions: [],
    loading: true
  },
  reducers: {
    handleLoadingClusters: (state, action) => {
      state.loading = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    })
  }
})

export const { handleLoadingClusters } = appClusterSlice.actions

export default appClusterSlice.reducer
