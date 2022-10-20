// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { listMOrders } from '../../../graphql/queries'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

export const getOrders = async params => {
  const { status, location, dates, q } = params

  const filter = status
    ? {
        status: {
          eq: status
        },
        address: {
          contains: location != '' ? location : ','
        }
      }
    : {
        address: {
          contains: location != '' ? location : ','
        }
      }

  var orders = []
  var nextToken = null
  for (var i = 0; i < 10; i++) {
    const ordersResponse = await API.graphql(
      graphqlOperation(listMOrders, {
        filter,
        nextToken,
        limit: 5000
      })
    )
    orders = [...orders, ...ordersResponse.data.listMOrders.items]
    nextToken = ordersResponse.data.listMOrders.nextToken

    if (nextToken == null) break
  }

  const queryLowered = q.toLowerCase()

  const filteredData = orders.filter(order => {
    if (dates.length) {
      const [start, end] = dates
      const filtered = []
      const range = getDateRange(start, end)
      const orderDate = new Date(order.orderDate)
      range.filter(date => {
        const rangeDate = new Date(date)
        if (
          orderDate.getFullYear() === rangeDate.getFullYear() &&
          orderDate.getDate() === rangeDate.getDate() &&
          orderDate.getMonth() === rangeDate.getMonth()
        ) {
          filtered.push(order.number)
        }
      })

      if (filtered.length && filtered.includes(order.number)) {
        return (
          order.id.toLowerCase().includes(queryLowered) ||
          order.address.toLowerCase().includes(queryLowered) ||
          order.customerName.toLowerCase().includes(queryLowered) ||
          String(order.subscriptionID).toLowerCase().includes(queryLowered) ||
          String(order.assignedRouteID).toLowerCase().includes(queryLowered) ||
          String(order.status).toLowerCase().includes(queryLowered)
        )
      }
    } else {
      return (
        order.id.toLowerCase().includes(queryLowered) ||
        order.address.toLowerCase().includes(queryLowered) ||
        order.customerName.toLowerCase().includes(queryLowered) ||
        String(order.subscriptionID).toLowerCase().includes(queryLowered) ||
        String(order.assignedRouteID).toLowerCase().includes(queryLowered) ||
        String(order.status).toLowerCase().includes(queryLowered)
      )
    }
  })

  return filteredData
}
