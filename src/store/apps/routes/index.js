// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Mails
export const fetchMails = createAsyncThunk('appEmail/fetchMails', async params => {
  const response = await axios.get('/apps/email/emails', {
    params
  })

  return { ...response.data, filter: params }
})

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async id => {
  const response = await axios.get('/apps/email/get-email', {
    params: {
      id
    }
  })

  return response.data
})

// ** Update Mail
export const updateMail = createAsyncThunk('appEmail/updateMail', async (params, { dispatch, getState }) => {
  const response = await axios.post('/apps/email/update-emails', {
    data: { emailIds: params.emailIds, dataToUpdate: params.dataToUpdate }
  })
  await dispatch(fetchMails(getState().email.filter))
  if (Array.isArray(params.emailIds)) {
    await dispatch(getCurrentMail(params.emailIds[0]))
  }

  return response.data
})

// ** Update Mail Label
export const updateMailLabel = createAsyncThunk('appEmail/updateMailLabel', async (params, { dispatch, getState }) => {
  const response = await axios.post('/apps/email/update-emails-label', {
    data: { emailIds: params.emailIds, label: params.label }
  })
  await dispatch(fetchMails(getState().email.filter))
  if (Array.isArray(params.emailIds)) {
    await dispatch(getCurrentMail(params.emailIds[0]))
  }

  return response.data
})

// ** Prev/Next Mails
export const paginateMail = createAsyncThunk('appEmail/paginateMail', async params => {
  const response = await axios.get('/apps/email/paginate-email', { params })

  return response.data
})

export const appOrderSlice = createSlice({
  name: 'appOrders',
  initialState: {
    orders: null,
    filter: {
      region: '',
      name: '',
      distance: 200
    },
    currentOrder: null,
    selectedOrders: []
  },
  reducers: {
    handleSelectOrder: (state, action) => {
      const orders = state.selectedOrders
      if (!orders.includes(action.payload)) {
        orders.push(action.payload)
      } else {
        orders.splice(orders.indexOf(action.payload), 1)
      }
      state.selectedOrders = orders
    },
    handleSelectAllOrders: (state, action) => {
      const selectAllOrders = []
      if (action.payload && state.orders !== null) {
        selectAllOrders.length = 0

        // @ts-ignore
        state.orders.forEach(order => selectAllOrders.push(order.number))
      } else {
        selectAllOrders.length = 0
      }
      state.selectedOrders = selectAllOrders
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMails.fulfilled, (state, action) => {
      state.mails = action.payload.emails
      state.filter = action.payload.filter
      state.mailMeta = action.payload.emailsMeta
    })
    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
    builder.addCase(paginateMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
  }
})

export const { handleSelectOrder, handleSelectAllOrders } = appOrderSlice.actions

export default appOrderSlice.reducer
