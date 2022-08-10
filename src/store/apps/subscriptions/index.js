import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { Console, CosineWave } from 'mdi-material-ui';

// ** Third Party Imports
import Papa from "papaparse";

// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createMpsSubscription } from '../../../graphql/mutations'
import { listMpsSubscriptions } from '../../../graphql/queries'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

export const fetchData = createAsyncThunk('appSubscriptions/fetchData', async params => {
  const {status, location, dates, q} = params

  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    filter: {
        status: {
          eq: status != '' ? status : 'Actived'
        },
        address: {
          contains: location != '' ? location : ','
        }
    },
    limit: 5000
  }))

  const queryLowered = q.toLowerCase()

  const filteredData = response.data.listMpsSubscriptions.items.filter(subscription => {
    if (dates.length) {
      const [start, end] = dates
      const filtered = []
      const range = getDateRange(start, end)
      const subscriptionDate = new Date(subscription.subscriptionDate)
      range.filter(date => {
        const rangeDate = new Date(date)
        if (
          subscriptionDate.getFullYear() === rangeDate.getFullYear() &&
          subscriptionDate.getDate() === rangeDate.getDate() &&
          subscriptionDate.getMonth() === rangeDate.getMonth()
        ) {
          filtered.push(subscription.number)
        }
      })

      if (filtered.length && filtered.includes(subscription.number)) {
        return (
          (subscription.address.toLowerCase().includes(queryLowered) ||
          subscription.name.toLowerCase().includes(queryLowered) ||
          String(subscription.number).toLowerCase().includes(queryLowered) ||
          String(subscription.phone).toLowerCase().includes(queryLowered) ||
          String(subscription.mealPlan).toLowerCase().includes(queryLowered) ||
          String(subscription.status).toLowerCase().includes(queryLowered))
        )
      }
    } else {
      return (
        (subscription.address.toLowerCase().includes(queryLowered) ||
          subscription.name.toLowerCase().includes(queryLowered) ||
          String(subscription.number).toLowerCase().includes(queryLowered) ||
          String(subscription.phone).toLowerCase().includes(queryLowered) ||
          String(subscription.mealPlan).toLowerCase().includes(queryLowered) ||
          String(subscription.status).toLowerCase().includes(queryLowered))
      )
    }
  })

  return filteredData
})

// ** Load Subscriptions
export const loadData = createAsyncThunk('appSubscriptions/loadData', async (params, { getState })  => {
  const subscriptions = []
  const parsedData = ''

  const state = getState()
  const oldSubscriptions = state.subscriptions.data;

  // ** Read external final
  await Promise.all(
    (function* () {
        yield new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsText(params.file);
        })})())
    .then(async parsedSubscriptions => {
      const csv = Papa.parse(parsedSubscriptions.toString(),{ 
        delimiter: "", // auto-detect 
        newline: "", // auto-detect 
        quoteChar: '"', 
        escapeChar: '"', 
        header: true, // creates array of {head:value} 
        dynamicTyping: false, // convert values to numbers if possible
        skipEmptyLines: true 
      })
      parsedData = csv?.data;
    });
  
  // ** Process subscriptions (retreive lat and lng)
  subscriptions = await syncSubscriptions(parsedData, oldSubscriptions)
  return subscriptions
})


const syncSubscriptions = async (parsedData, oldSubscriptions) => {
  var synced = []
  var removed = []
  var toInclude = []
  var included = []
  var newSubscriptions = []
  var failed = []

  for (var i= 0; i < parsedData.length; i++) {
    if(i % 2 == 0) {
      newSubscriptions.push({
        id: parsedData[i].number + parsedData[i].name,
        number: parsedData[i].number,
        subscriptionDate: Date.now(),
        address: parsedData[i].Address,
        email: parsedData[i].email,
        phone: parsedData[i].phone,
        name: parsedData[i].name,
        mealPlan: parsedData[i + 1].name,
        latitude: 0,
        avatar: '',
        status: 'Actived',
        longitude: 0,
        deliveryInstruction: parsedData[i + 1].Address
      })
    }
  }
  
  var oldSubscriptionsNumber = []
  oldSubscriptions.map(sub => oldSubscriptionsNumber.push(sub.number + sub.name))
  var newSubscriptionsNumber = []
  newSubscriptions.map(sub => newSubscriptionsNumber.push(sub.number + sub.name))

  synced = newSubscriptions.filter(subscription => {
    return oldSubscriptionsNumber.includes(subscription.number + subscription.name)
  });

  removed = oldSubscriptions.filter(subscription => {
    return !newSubscriptionsNumber.includes(subscription.number + subscription.name)
  });

  toInclude = newSubscriptions.filter(subscription => {
    return !oldSubscriptionsNumber.includes(subscription.number + subscription.name)
  });

  if(oldSubscriptions.length > 1500) {
    for(var i = 0; i < toInclude.length; i++) {
      const urlRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + toInclude[i].address + '&key=AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo'
        await axios.get(urlRequest.replaceAll('#','n')).then(async (response) => {
          if(response.data.results.length > 0) {
            toInclude[i].address = response.data.results[0].formatted_address
            toInclude[i].latitude = response.data.results[0].geometry.location.lat
            toInclude[i].longitude = response.data.results[0].geometry.location.lng
            console.log('pushing: ' + JSON.stringify(toInclude[i]))
            await API.graphql(graphqlOperation(createMpsSubscription, {input: toInclude[i]}))
            console.log(response.data.results[0].geometry.location.lat, ',', response.data.results[0].geometry.location.lng)
            console.log('pushing to store: ' + JSON.stringify(toInclude[i]))
            included.push(toInclude[i])
          }
          else {
            failed.push(toInclude[i])
            console.log('error for: ' + urlRequest)
          }    
        }).catch(err => {
          failed.push(toInclude[i])
          console.log('CRITICAL ERROR: ' + JSON.stringify(err))
        })
    }
  }
  else {
    synced = []
    removed = []
    toInclude = []
    included = []
    newSubscriptions = []
    failed = []
  }
  
  return {synced, removed, included, failed}
}

export const deleteSubscription = createAsyncThunk('appSubscriptions/deleteData', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/apps/subscriptions/delete', {
    data: id
  })
  await dispatch(fetchData(getState().invoice.params))

  return response.data
})

const retreiveLocation = (address) => {
  const addressComponents =  address.split(',')
  const locationIndex = addressComponents.length - 3
  return addressComponents[locationIndex]
}

export const appSubscriptionSlice = createSlice({
  name: 'appSubscriptions',
  initialState: {
    data: [],
    removeds: [],
    included: [],
    total: 1,
    params: {},
    allData: [],
    locations: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      for(var i = 0; i < action.payload.length; i++) {
        const location = retreiveLocation(action.payload[i].address)
        if(!state.locations.includes(location)) {
          state.locations.push(location)
        }
      }
      const subsToRefreshSorted = action.payload.sort((a, b) => parseFloat(a.subscriptionDate) - parseFloat(b.subscriptionDate))
      state.data = subsToRefreshSorted
      state.params = action.payload.params
      state.allData = action.payload
      state.total = action.payload.total
    })
    builder.addCase(loadData.fulfilled, (state, action) => {
      console.log('received in store: ' + JSON.stringify(action.payload))
      const { synced, included } = action.payload
      const subsToRefresh = state.data.concat(included)
      const subsToRefreshSorted = subsToRefresh.sort((a, b) => parseFloat(a.subscriptionDate) - parseFloat(b.subscriptionDate))
      state.data = subsToRefreshSorted
      state.params = action.payload.params
      state.allData = action.payload
      state.total = action.payload.length
    })
  }
})

export default appSubscriptionSlice.reducer
