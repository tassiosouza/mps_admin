// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AssignStatus } from 'src/models'

// ** Repository Imports
import {
  getClusters,
  getSubscriptions,
  getDrivers,
  getGraphHopperRoutes,
  saveRoutesAndOrders,
  fetchOrders,
  fetchRoutes,
  assignAmplifyDriver,
  unassignAmplifyDriver
} from 'src/repository/apps/routes'

// ** Fetch Clusters from Server
export const fetchClusters = createAsyncThunk('appRoutes/fetchClusters', async params => {
  const { clusters } = await getClusters(params)
  const { subscriptions } = await getSubscriptions()
  return { clusters, subscriptions }
})

// ** Fetch Drivers from Server
export const fetchDrivers = createAsyncThunk('appRoutes/fetchDrivers', async params => {
  const drivers = await getDrivers(params)
  return drivers
})

// ** Generate Optimized Routes
export const generateRoutes = createAsyncThunk('appRoutes/generateRoutes', async params => {
  const { callback } = params
  const { routes, solution, orders } = await getGraphHopperRoutes(params)
  return { routes, solution, orders, callback }
})

// ** Generate Optimized Routes
export const fetchRoutesAndOrders = createAsyncThunk('appRoutes/fetchRoutesAndOrders', async params => {
  const { status, clusterId, dates, q } = params

  const routes = await fetchRoutes(status)
  const orders = await fetchOrders()
  const { clusters } = await getClusters({ q: '' })

  // ** Filter routes to return to Interface
  const queryLowered = q.toLowerCase()

  const filteredData = routes.filter(route => {
    if (dates.length) {
      const [start, end] = dates
      const filtered = []
      const range = getDateRange(start, end)
      const routeDate = new Date(route.routeDate)
      range.filter(date => {
        const rangeDate = new Date(date)
        if (
          routeDate.getFullYear() === rangeDate.getFullYear() &&
          routeDate.getDate() === rangeDate.getDate() &&
          routeDate.getMonth() === rangeDate.getMonth()
        ) {
          filtered.push(route.id)
        }
      })

      if (filtered.length && filtered.includes(route.id)) {
        return route.id.toLowerCase().includes(queryLowered) || route.status.toLowerCase().includes(queryLowered)
      }
    } else {
      return route.id.toLowerCase().includes(queryLowered) || route.status.toLowerCase().includes(queryLowered)
    }
  })

  filteredData = filteredData.filter(route => route.clusterId.includes(clusterId))

  return { routes: filteredData, orders, clusters }
})

// ** Save Generated Routes to Amplify
export const saveRoutes = createAsyncThunk('appRoutes/saveRoutes', async (params, { getState }) => {
  const { callback } = params
  const newRoutes = getState().routes.tempRoutes
  const newOrders = getState().routes.tempOrders

  const ordersID = newOrders.map(order => order.subscriptionID)
  const subscriptionsToUpdate = getState().routes.subscriptions.filter(sub => ordersID.includes(sub.id))

  // ** Save Routes in Amplify
  const { routes, orders, locations, subscriptions } = await saveRoutesAndOrders(
    newRoutes,
    newOrders,
    subscriptionsToUpdate
  )

  return { routes, orders, locations, subscriptions, callback }
})

// ** Assign Driver to Route
export const assignDriver = createAsyncThunk('appRoutes/assignDriver', async params => {
  const { routeID, driverID, callback } = params

  // Assign driver to route in Amplify
  const { route, driver, error } = await assignAmplifyDriver(routeID, driverID)

  return { error, route, driver, driverID, callback }
})

// ** Assign Driver to Route
export const unassignDriver = createAsyncThunk('appRoutes/unassignDriver', async params => {
  const { routeID, driverID, callback } = params

  // Unsassign driver to route in Amplify
  const { route, driver, error } = await unassignAmplifyDriver(routeID, driverID)

  return { error, route, driver, driverID, callback }
})

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
    selectedClusters: [],
    subscriptions: [],
    drivers: [],
    routes: [],
    tempRoutes: [],
    solution: null,
    tempOrders: [],
    orders: [],
    clusters: [],
    loadingRoutes: true
  },
  reducers: {
    setLoadingRoutes: (state, action) => {
      state.loadingRoutes = action
    },
    setAssigningDriver: (state, action) => {
      for (var i = 0; i < state.drivers.length; i++) {
        if (state.drivers[i].id === action.payload.driverID) {
          state.drivers[i].assignStatus = AssignStatus.ASSIGNING
        }
      }
    },
    clearSelectedLocations: (state, action) => {
      state.locations.map(loc => {
        loc.included = false
      })
      state.selectedLocations = []
    },
    clearTempResults: (state, action) => {
      state.tempRoutes = []
      state.solution = []
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchRoutesAndOrders.fulfilled, (state, action) => {
      const sortedRoutes = action.payload.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      state.orders = action.payload.orders
      state.clusters = action.payload.clusters
      state.loadingRoutes = false
    })
    builder.addCase(fetchClusters.fulfilled, (state, action) => {
      state.clusters = action.payload.clusters
      state.subscriptions = action.payload.subscriptions
    })
    builder.addCase(fetchDrivers.fulfilled, (state, action) => {
      state.drivers = action.payload
    })
    builder.addCase(generateRoutes.fulfilled, (state, action) => {
      state.solution = action.payload.solution
      state.tempRoutes = action.payload.routes
      state.tempOrders = action.payload.orders
      action.payload.callback()
    })
    builder.addCase(saveRoutes.fulfilled, (state, action) => {
      // ** Sort routes by last updated
      const sortedRoutes = action.payload.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes
      state.orders = action.payload.orders
      state.locations = action.payload.locations
      state.subscriptions = action.payload.subscriptions
      state.selectedLocations = []
      action.payload.callback()
    })
    builder.addCase(assignDriver.fulfilled, (state, action) => {
      const route = action.payload.route
      const driver = action.payload.driver
      const driverID = action.payload.driverID

      //** Assign performed with success
      if (action.payload.error == null) {
        for (var i = 0; i < state.drivers.length; i++) {
          //** Update driver on local store
          if (state.drivers[i].id === driver.id) {
            state.drivers[i] = driver
          }
        }
        for (var i = 0; i < state.routes.length; i++) {
          //** Update route on local store
          if (state.routes[i].id === route.id) {
            state.routes[i] = route
          }
        }
      } else {
        const drivers = state.drivers.filter(dr => dr.id === driverID)
        const driver = drivers[0]
        const index = state.drivers.indexOf(driver)
        state.drivers[index].assignStatus = AssignStatus.UNASSIGNED
      }

      // ** Sort routes by last updated
      const sortedRoutes = state.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes

      //** Return result to interface
      action.payload.callback(action.payload.error)
    })
    builder.addCase(unassignDriver.fulfilled, (state, action) => {
      const route = action.payload.route
      const driver = action.payload.driver
      const driverID = action.payload.driverID

      //** Unassign performed with success
      if (action.payload.error == null) {
        for (var i = 0; i < state.drivers.length; i++) {
          //** Update driver on local store
          if (state.drivers[i].id === driver.id) {
            state.drivers[i] = driver
          }
        }
        for (var i = 0; i < state.routes.length; i++) {
          //** Update route on local store
          if (state.routes[i].id === route.id) {
            state.routes[i] = route
          }
        }
      } else {
        const drivers = state.drivers.filter(dr => dr.id === driverID)
        const driver = drivers[0]
        const index = state.drivers.indexOf(driver)
        state.drivers[index].assignStatus = AssignStatus.ASSIGNED
      }

      // ** Sort routes by last updated
      const sortedRoutes = state.routes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.routes = sortedRoutes

      //** Return result to interface
      action.payload.callback(action.payload.error)
    })
  }
})

export const {
  addLocation,
  removeLocation,
  clearSelectedLocations,
  clearTempResults,
  setAssigningDriver,
  setLoadingRoutes
} = appRoutesSlice.actions

export default appRoutesSlice.reducer
