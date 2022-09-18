// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getClusters, getSubscriptions, updateRootCluster } from 'src/repository/apps/clusters'


// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appClusters/fetchClusters', async (params)  => {
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

// ** Create Clusters in the Server
export const createClusters = createAsyncThunk('appClusters/createClusters', async (params)  => {
  const { rootCluster } = params
  await updateRootCluster(rootCluster)
  const clusters = await getClusters(params)
  const subscriptions = await getSubscriptions()
  
  return { clusters, subscriptions }
})

const findAndSetChild = (parent, newChild) => {
  if(parent.children) {
    console.log('find: '+ JSON.stringify(parent))
    var updatedChildren = parent.children.children.map(child => {
      if(newChild.id === child.id) {
        child.open = !child.open
      }
      else {
        if(child.children) {
          child.children.children.map(child => {
            findAndSetChild(state, child)
          })
        }
      }
      return child
    })
    return { children: updatedChildren }
  }
}

const formatClusterChildren = (rootCluster) => {
  if(rootCluster) {
    var formated = rootCluster.children.map(child => {
      console.log('define')
      Object.defineProperties(child, {
        open: {
          value: false,
          writable: true,
        },
      }),
      Object.defineProperties(child, {
        children: {
          value: child.children ? child.children : null,
          writable: true,
        },
      })
      if(child.children != null) {
        child.children.children.map(ch => formatClusterChildren(ch.children))
      }
      return child
    })
    console.log('formated: ' + JSON.stringify(formated))
    return { children:formated } 
  }
}

export const appClusterSlice = createSlice({
  name: 'appClusters',
  initialState: {
    clusters: [],
    subscriptions: [],
    loading: true,
    creatingClusters: false
  },
  reducers: {
    handleLoadingClusters: (state, action) => {
      state.loading = action.payload
    },
    handleSetOpenCluster: (state, action) => {
      const cluster = action.payload
      if(state.clusters[0].id === cluster.id) {
        state.clusters[0] = { ...state.clusters[0], open:!cluster.open}
      }
      else {
        state.clusters[0] = { ...state.clusters[0], children: findAndSetChild(state.clusters[0], cluster)}
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      var childObj = JSON.parse(action.payload.clusters[0].children)
      var children = formatClusterChildren(childObj)
      state.clusters[0] = {...action.payload.clusters[0], children:children}
      state.subscriptions = action.payload.subscriptions
      state.loading = false
    }),
    builder.addCase(createClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
      state.creatingClusters = false
    })
  }
})

export const { handleLoadingClusters, handleSetOpenCluster } = appClusterSlice.actions

export default appClusterSlice.reducer
