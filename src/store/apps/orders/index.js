// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Repository Imports
import { getOrders } from 'src/repository/apps/orders'

// ** Fetch Orders from Server
export const fetchOrders = createAsyncThunk('appOrders/fetchOrders', async params => {
  const orders = await getOrders(params)

  return orders
})

export const appOrderSlice = createSlice({
  name: 'appOrders',
  initialState: {
    data: [],
    params: {},
    locations: [],
    loading: false
  },
  reducers: {
    handleLoadingOrders: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      // ** Retreive Locations from fetched orders
      for (var i = 0; i < action.payload.length; i++) {
        const location = action.payload[i].location
        if (!state.locations.includes(location)) {
          state.locations.push(location)
        }
      }
      // ** Sort routes by last updated
      const sortedOrders = action.payload.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      state.data = sortedOrders
      state.loading = false
    })
  }
})

export const { handleLoadingOrders } = appOrderSlice.actions

export default appOrderSlice.reducer
