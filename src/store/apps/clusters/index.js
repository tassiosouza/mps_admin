// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CarKey } from 'mdi-material-ui'

// ** Repository Imports
import {
  getClusters,
  getSubscriptions,
  updateClusterLocally,
  saveClustersAndSubscriptions,
  deleteRemoteClusters,
  recalculateRemoteClusters
} from 'src/repository/apps/clusters'

// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async params => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()

  return { clusters, subscriptions }
})

// ** Create Clusters in the Server
export const saveCluster = createAsyncThunk('appClusters/saveCluster', async (params, { getState }) => {
  const { name, min, max, callback } = params
  const subs = getState().clusters.subscriptions
  const cluster = {
    ...getState().clusters.editingCluster,
    name: name,
    minBags: min > 0 ? min : getState().clusters.editingCluster.minBags,
    maxBags: max > 0 ? max : getState().clusters.editingCluster.maxBags
  }
  await saveClustersAndSubscriptions(subs, cluster)

  const clusters = await getClusters({ q: '' })
  const subscriptions = await getSubscriptions()

  return { clusters, subscriptions, callback }
})

// ** Update Cluster and subscriptions locally
export const updateCluster = createAsyncThunk('appClusters/updateCluster', async (params, { getState }) => {
  const { nextPath } = params
  const cluster = { ...getState().clusters.editingCluster, path: nextPath }
  const subscriptions = getState().clusters.subscriptions
  const updatedSubscriptions = await updateClusterLocally(cluster, subscriptions)

  return { updatedCluster: cluster, updatedSubscriptions }
})

const getLastSelectedCenter = selectedClusters => {
  const cluster = selectedClusters[selectedClusters.length - 1]
  return polygonCenter(cluster.path)
}

// ** Delete Clusters in Amplify
export const deleteClusters = createAsyncThunk('appClusters/deleteClusters', async (params, { getState }) => {
  const { clustersToDelete, callback } = params

  const subscriptionsToUpdate = getState().clusters.subscriptions.filter(sub => {
    for (var i = 0; i < clustersToDelete.length; i++) {
      if (clustersToDelete[i].id === sub.clusterId) {
        return true
      }
    }
    return false
  })
  await deleteRemoteClusters(clustersToDelete, subscriptionsToUpdate)

  const clusters = await getClusters({ q: '' })
  const subscriptions = await getSubscriptions()

  return { clusters, subscriptions, callback }
})

// ** Recalculate Clusters in Amplify
export const recalculateClusters = createAsyncThunk('appClusters/recalculateClusters', async (params, { getState }) => {
  const { clustersToRecalculate, callback } = params
  await recalculateRemoteClusters(clustersToRecalculate, getState().clusters.subscriptions)

  const clusters = await getClusters({ q: '' })
  const subscriptions = await getSubscriptions()

  return { clusters, subscriptions, callback }
})

// ** Set Subscriptions Assignments
export const setSubscriptionsAssignment = createAsyncThunk('appClusters/setSubscriptionsAssignment', async params => {
  const { subscriptionsToUpdate, cluster } = params
  const updatedSubscriptions = subscriptionsToUpdate.map(sub => {
    var subscription = { ...sub }
    if (subscription.clusterId === '') {
      subscription.clusterId = cluster.id
      subscription.color = cluster.color
    } else {
      subscription.clusterId = ''
      subscription.color = '#363636'
    }
    subscription.editing = true
    return subscription
  })

  return { subscriptions: updatedSubscriptions }
})

const polygonCenter = path => {
  var vertices
  if (path) {
    vertices = path
  } else {
    vertices = [
      { lat: 33.3047610128895, lng: -117.38569404687499 },
      { lat: 33.17023062920513, lng: -117.4320085 },
      { lat: 33.168072587211924, lng: -117.20816206445312 },
      { lat: 33.31394248217619, lng: -117.2694606484375 }
    ]
  }

  // put all latitudes and longitudes in arrays
  const longitudes = vertices.map(ver => ver.lng)
  const latitudes = vertices.map(ver => ver.lat)

  // sort the arrays low to high
  latitudes.sort()
  longitudes.sort()

  // get the min and max of each
  const lowX = latitudes[0]
  const highX = latitudes[latitudes.length - 1]
  const lowy = longitudes[0]
  const highy = longitudes[latitudes.length - 1]

  // center of the polygon is the starting point plus the midpoint
  const centerX = lowX + (highX - lowX) / 2
  const centerY = lowy + (highy - lowy) / 2

  return { lat: centerX, lng: centerY }
}

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    currentZoom: 8.52,
    currentCenter: {
      lat: 33.152428,
      lng: -117.227941
    },
    clusters: [],
    selectedClusters: [],
    subscriptions: [],
    editingCluster: null,
    loading: true,
    saving: false,
    selectedDetachedSubscriptions: [],
    selectedAttachedSubscriptions: []
  },
  reducers: {
    handleCleanSelection: (state, action) => {
      state.subscriptions = state.subscriptions.map(sub => {
        if (sub.editing) {
          if (sub.clusterId === '') {
            return {
              ...sub,
              editing: false,
              clusterId: state.selectedClusters[0].id,
              color: state.selectedClusters[0].color
            }
          } else {
            return { ...sub, editing: false, clusterId: '', color: '#363636' }
          }
        }
        return sub
      })
      state.editingCluster = null
      state.currentZoom = 8.53
      state.currentCenter = {
        lat: 33.152428,
        lng: -117.227941
      }
      state.selectedClusters = action.payload
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

      // ** Update Selected Clusters and Zoom/Focus Control
      state.selectedClusters = clusters
      state.currentZoom = state.selectedClusters.length ? 11 : 8.52
      state.currentCenter = state.selectedClusters.length
        ? getLastSelectedCenter(state.selectedClusters)
        : {
            lat: 33.152428,
            lng: -117.227941
          }
    },
    handleAddCluster: (state, action) => {
      const cluster = action.payload
      state.selectedClusters = [cluster]
      state.editingCluster = cluster

      // ** Update Selected Clusters and Zoom/Focus Control
      state.currentZoom = state.selectedClusters.length ? 11 : 8.52
      state.currentCenter = state.selectedClusters.length
        ? getLastSelectedCenter(state.selectedClusters)
        : {
            lat: 33.152428,
            lng: -117.227941
          }
    },
    handleOpenCluster: (state, action) => {
      state.selectedClusters = [action.payload]

      // ** Update Selected Clusters and Zoom/Focus Control
      state.currentZoom = state.selectedClusters.length ? 11 : 8.52
      state.currentCenter = state.selectedClusters.length
        ? getLastSelectedCenter(state.selectedClusters)
        : {
            lat: 33.152428,
            lng: -117.227941
          }
    },
    editCluster: (state, action) => {
      state.editingCluster = { ...action.payload, editing: true }
      state.selectedClusters = [state.editingCluster]
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

      // ** Update Selected Clusters and Zoom/Focus Control
      state.currentZoom = state.selectedClusters.length ? 11 : 8.52
      state.currentCenter = state.selectedClusters.length
        ? getLastSelectedCenter(state.selectedClusters)
        : {
            lat: 33.152428,
            lng: -117.227941
          }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters.map(cl => {
        return { ...cl, hover: false, path: JSON.parse(cl.path) }
      })
      state.clusters = state.clusters.sort((a, b) => (a.name > b.name ? 1 : -1))
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    }),
      builder.addCase(saveCluster.fulfilled, (state, action) => {
        // ** Update clusters and subscriptions states
        state.clusters = action.payload.clusters.map(cl => {
          return { ...cl, hover: false, path: JSON.parse(cl.path) }
        })
        state.clusters = state.clusters.sort((a, b) => (a.name > b.name ? 1 : -1))
        state.subscriptions = action.payload.subscriptions
        state.editingCluster = null
        state.saving = false
        state.loading = false
        state.selectedClusters = []
        action.payload.callback()
      }),
      builder.addCase(updateCluster.fulfilled, (state, action) => {
        if (state.editingCluster.new == true) {
          // ** Update new cluster with updated cluster
          state.editingCluster = action.payload.updatedCluster
        } else {
          // ** Update clusters list with updated cluster
          state.editingCluster = action.payload.updatedCluster
        }

        // ** Update Subscriptions
        const updatedSubscriptions = action.payload.updatedSubscriptions
        var updatedSubscriptionsIds = updatedSubscriptions.map(s => s.id)
        state.subscriptions = state.subscriptions.map(sub => {
          if (updatedSubscriptionsIds.includes(sub.id)) {
            var updated = updatedSubscriptions.find(s => s.id === sub.id)
            return updated
          }
          return sub
        })

        state.loading = false
      }),
      builder.addCase(deleteClusters.fulfilled, (state, action) => {
        // ** Update clusters and subscriptions states
        state.clusters = action.payload.clusters.map(cl => {
          return { ...cl, hover: false, path: JSON.parse(cl.path) }
        })
        state.clusters = state.clusters.sort((a, b) => (a.name > b.name ? 1 : -1))
        state.subscriptions = action.payload.subscriptions

        // ** Call delete callback
        action.payload.callback()
      }),
      builder.addCase(recalculateClusters.fulfilled, (state, action) => {
        // ** Update clusters and subscriptions states
        state.clusters = action.payload.clusters.map(cl => {
          return { ...cl, hover: false, path: JSON.parse(cl.path) }
        })
        state.clusters = state.clusters.sort((a, b) => (a.name > b.name ? 1 : -1))
        state.subscriptions = action.payload.subscriptions

        // ** Call delete callback
        action.payload.callback()
      }),
      builder.addCase(setSubscriptionsAssignment.fulfilled, (state, action) => {
        // ** Update subscriptions states
        const updatedSubscriptions = action.payload.subscriptions
        var updatedSubscriptionsIds = updatedSubscriptions.map(s => s.id)
        state.subscriptions = state.subscriptions.map(sub => {
          if (updatedSubscriptionsIds.includes(sub.id)) {
            var updated = updatedSubscriptions.find(s => s.id === sub.id)
            return updated
          }
          return sub
        })
      })
  }
})

export const {
  handleLoadingClusters,
  handleSetOpenCluster,
  handleSelectAllClusters,
  handleSavingClusters,
  handleSelectCluster,
  handleCleanSelection,
  handleAddCluster,
  handleHover,
  handleOpenCluster,
  editCluster
} = appClusterSlice.actions

export default appClusterSlice.reducer
