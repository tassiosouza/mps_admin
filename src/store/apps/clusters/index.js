// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions, addClusterLocally, updateClusterLocally,  saveClustersAndSubscriptions } from 'src/repository/apps/clusters'


// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

// ** Create Clusters and Modify subscriptions locally
export const createCluster = createAsyncThunk('appClusters/createClusters', async (params, {getState})  => {
  const { cluster } = params
  const subscriptions = getState().clusters.subscriptions
  const {newCluster, updatedSubscriptions} = await addClusterLocally(cluster, subscriptions)

  return {clusters: newCluster, subscriptions: updatedSubscriptions}
})

// ** Create Clusters in the Server
export const saveCluster = createAsyncThunk('appClusters/saveCluster', async (params, {getState})  => {
  const subs = getState().clusters.subscriptions
  const clus = getState().clusters.clusters
  await saveClustersAndSubscriptions(subs, clus)

  const clusters = await getClusters({q:''})
  const subscriptions = await getSubscriptions()

  return {clusters, subscriptions}
})

// ** Update Cluster and subscriptions locally
export const updateCluster = createAsyncThunk('appClusters/updateCluster', async (params, {getState})  => {
  const { cluster } = params
  const subscriptions = getState().clusters.subscriptions
  const updatedSubscriptions = await updateClusterLocally(cluster, subscriptions)

  return {updatedCluster: {...cluster, subscriptionsCount: updatedSubscriptions.length}, updatedSubscriptions}
})

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    clusters: [],
    selectedClusters:[],
    subscriptions: [],
    loading: true,
  },
  reducers: {
    handleCleanSelection: (state, action) => {
      state.clusters = state.clusters.filter(cluster => cluster.new === false)
      state.selectedClusters = action.payload
    },
    handleLoadingClusters: (state, action) => {
      state.loading = action.payload
    },
    handleSelectCluster: (state, action) => {
      const clusters = state.selectedClusters
      if (!clusters.includes(action.payload)) {
        clusters.push(action.payload)
      } else {
        clusters.splice(clusters.indexOf(action.payload), 1)
      }
      state.selectedClusters = clusters
    },
    handleSetOpenCluster: (state, action) => {
      const cluster = action.payload
      state.selectedClusters = [cluster]
      state.clusters = [...state.clusters, cluster]
    },
    handleSelectAllClusters: (state, action) => {
      const selectAllClusters = []
      if (action.payload && state.clusters !== null) {
        selectAllClusters.length = 0

        // @ts-ignore
        state.clusters.forEach(cluster => selectAllClusters.push(cluster.id))
      } else {
        selectAllClusters.length = 0
      }
      state.selectedClusters = selectAllClusters
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    }),
    builder.addCase(createCluster.fulfilled, (state, action) => {
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
      state.clusters = [...state.clusters, action.payload.cluster]
      state.loading = false
    }),
    builder.addCase(saveCluster.fulfilled, (state, action) => {
      // ** Update clusters and subscriptions states
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    }),
    builder.addCase(updateCluster.fulfilled, (state, action) => {
      // ** Update clusters list with updated cluster
      var updatedCluster = action.payload.updatedCluster
      var oldCluster = state.clusters.find(cluster => cluster.id === updatedCluster.id)
      var clusterIndex = state.clusters.indexOf(oldCluster)
      state.clusters[clusterIndex] = updatedCluster
      
      // ** Update Subscriptions
      const updatedSubscriptions = action.payload.updatedSubscriptions
      var updatedSubscriptionsIds = updatedSubscriptions.map(s => s.id)
      state.subscriptions = state.subscriptions.map(sub => {
        if(updatedSubscriptionsIds.includes(sub.id)) {
          var updated = updatedSubscriptions.find(s => s.id === sub.id)
          return updated
        }
        return sub
      })

      state.loading = false
    })
  }
})

export const { handleLoadingClusters, handleSetOpenCluster, handleSelectAllClusters, handleSelectCluster, handleCleanSelection } = appClusterSlice.actions

export default appClusterSlice.reducer
