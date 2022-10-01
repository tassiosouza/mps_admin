// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions, updateClusterLocally,  saveClustersAndSubscriptions } from 'src/repository/apps/clusters'

// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

// ** Create Clusters in the Server
export const saveCluster = createAsyncThunk('appClusters/saveCluster', async (params, {getState})  => {
  const { name, callback } = params
  const subs = getState().clusters.subscriptions
  const cluster = {...getState().clusters.editingCluster, name: name}
  await saveClustersAndSubscriptions(subs, cluster)

  const clusters = await getClusters({q:''})
  const subscriptions = await getSubscriptions()

  return {clusters, subscriptions, callback}
})

// ** Update Cluster and subscriptions locally
export const updateCluster = createAsyncThunk('appClusters/updateCluster', async (params, {getState})  => {
  const { nextPath } = params
  const cluster = {...getState().clusters.editingCluster, path: nextPath}
  const subscriptions = getState().clusters.subscriptions
  const updatedSubscriptions = await updateClusterLocally(cluster, subscriptions)
  cluster = {...getState().clusters.editingCluster, path: nextPath}

  return {updatedCluster: cluster, updatedSubscriptions}
})

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    clusters: [],
    selectedClusters:[],
    subscriptions: [],
    editingCluster:null,
    loading: true,
    saving: false
  },
  reducers: {
    handleCleanSelection: (state, action) => {
      state.selectedClusters = action.payload
      state.subscriptions = state.subscriptions.map(sub => {
        if(sub.editing) {
          return {...sub, editing:false, clusterId:'', color:'#363636' }
        }
        return sub
      })
      state.editingCluster = null
    },
    handleLoadingClusters: (state, action) => {
      state.loading = action.payload
    },
    handleSavingClusters: (state, action) => {
      state.saving = action.payload
    },
    handleHover: (state, action) => {
      const clusterHover = action.payload.cluster
      const index = state.clusters.indexOf(state.clusters.find(cl => cl.id === clusterHover.id))
      state.clusters[index].hover = action.payload.hover
    },
    handleSelectCluster: (state, action) => {
      const clusters = state.selectedClusters
      const foundCluster = clusters.find(cl => cl.id === action.payload.id)
      if (foundCluster == null) {
        clusters.push(action.payload)
      } else {
        clusters.splice(clusters.indexOf(foundCluster), 1)
      }
      state.selectedClusters = clusters
    },
    handleAddCluster: (state, action) => {
      const cluster = action.payload
      state.selectedClusters = [cluster]
      state.editingCluster = cluster
    },
    handleOpenCluster: (state, action) => {
      state.selectedClusters = [action.payload]
    },
    handleSelectAllClusters: (state, action) => {
      const selectAllClusters = []
      if (action.payload && state.clusters !== null) {
        selectAllClusters.length = 0

        // @ts-ignore
        state.clusters.forEach(cluster => selectAllClusters.push(cluster))
      } else {
        selectAllClusters.length = 0
      }
      state.selectedClusters = selectAllClusters
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters.map(cl => {
        return {...cl, hover:false}
      })
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    }),
    builder.addCase(saveCluster.fulfilled, (state, action) => {
      // ** Update clusters and subscriptions states
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.editingCluster = null
      state.saving = false
      state.loading = false
      state.selectedClusters = []
      action.payload.callback()
    }),
    builder.addCase(updateCluster.fulfilled, (state, action) => {
      if(state.editingCluster.new == true) {
        // ** Update new cluster with updated cluster
        state.editingCluster = action.payload.updatedCluster
      } else {
        // ** Update clusters list with updated cluster
        var updatedCluster = action.payload.updatedCluster
        var oldCluster = state.clusters.find(cluster => cluster.id === updatedCluster.id)
        var clusterIndex = state.clusters.indexOf(oldCluster)
        state.clusters[clusterIndex] = updatedCluster
      }
      
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

export const { handleLoadingClusters, handleSetOpenCluster, handleSelectAllClusters,
  handleSavingClusters, handleSelectCluster, handleCleanSelection, handleAddCluster, handleHover, handleOpenCluster } = appClusterSlice.actions

export default appClusterSlice.reducer
