// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions, addClusters, saveClustersAndSubscriptions } from 'src/repository/apps/clusters'


// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

// ** Create Clusters and Modify subscriptions locally
export const createClusters = createAsyncThunk('appClusters/createClusters', async (params, {getState})  => {
  const { parentCluster } = params
  const subscriptions = getState().clusters.subscriptions
  const {newClusters, updatedSubscriptions} = await addClusters(parentCluster, subscriptions)

  return {clusters: newClusters, subscriptions: updatedSubscriptions}
})

// ** Create Clusters in the Server
export const saveClustering = createAsyncThunk('appClusters/saveClustering', async (params, {getState})  => {
  const subs = getState().clusters.subscriptions
  const clus = getState().clusters.clusters
  await saveClustersAndSubscriptions(subs, clus)

  const clusters = await getClusters({q:''})
  const subscriptions = await getSubscriptions()

  return {clusters, subscriptions}
})

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    editingMode: false,
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
      // ** Update Subscriptions
      const updatedSubscriptions = action.payload.subscriptions
      var updatedSubscriptionsIds = updatedSubscriptions.map(s => s.id)
      state.subscriptions = state.subscriptions.map(sub => {
        if(updatedSubscriptionsIds.includes(sub.id)) {
          var updated = updatedSubscriptions.find(s => s.id === sub.id)
          return updated
        }
        return sub
      })

      // ** Update clusters and screen states
      state.clusters = [...state.clusters, ...action.payload.clusters]
      state.loading = false
      state.editingMode = true
    }),
    builder.addCase(saveClustering.fulfilled, (state, action) => {
      // ** Update clusters and subscriptions states
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false
      state.editingMode = false
    })
  }
})

export const { handleLoadingClusters, handleSetOpenCluster } = appClusterSlice.actions

export default appClusterSlice.reducer
