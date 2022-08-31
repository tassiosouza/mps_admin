// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import subscriptions from 'src/store/apps/subscriptions'
import routes from 'src/store/apps/routes'
import orders from 'src/store/apps/orders'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    orders,
    subscriptions,
    routes,
    calendar,
    permissions
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
