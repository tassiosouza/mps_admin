// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions, addClusters } from 'src/repository/apps/clusters'


// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

// ** Create Clusters in the Server
export const createClusters = createAsyncThunk('appClusters/createClusters', async (params, {getState})  => {
  const { parentCluster } = params
  const subscriptions = getState().clusters.subscriptions
  await addClusters(parentCluster, subscriptions)


  const clusters = await getClusters(params)
  const updatedSubscriptions = await getSubscriptions()
  
  return { clusters, subscriptions: updatedSubscriptions }
})

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    clusters: [],
    subscriptions: [],
    loading: true,
  },
  reducers: {
    handleLoadingClusters: (state, action) => {
      state.loading = action.payload
    },
    handleSetOpenCluster: (state, action) => {
      const cluster = action.payload
      const foundCluster = state.clusters.filter(cl => cl.id === cluster.id)
      if(foundCluster) {
        var index = state.clusters.indexOf(foundCluster[0])
        state.clusters[index] = {...foundCluster[0], open: !foundCluster[0].open}
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false

      // ** Update root cluster total count
      const rootCluster = state.clusters.filter(cluster => cluster.level === 1)
      rootCluster[0].subscriptionsCount = state.subscriptions.length
    }),
    builder.addCase(createClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    })
  }
})

export const { handleLoadingClusters, handleSetOpenCluster } = appClusterSlice.actions

export default appClusterSlice.reducer
