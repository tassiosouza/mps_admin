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

// ** Fetch Subscriptions
// export const fetchData = createAsyncThunk('appSubscriptions/fetchData', async params => {
//   const response = await axios.get('/apps/subscriptions/subscription', {
//     params
//   })
  
//   return response.data
// })

export const fetchData = createAsyncThunk('appSubscriptions/fetchData', async params => {
  const {status, location, dates, q} = params
  console.log('params - ' + JSON.stringify(params))
  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    filter: {
        status: {
          eq: status != '' ? status : 'Actived'
        },
        address: {
          contains: location != '' ? location : ','
        },
        subscriptionDate: {between: [Date.parse(dates[0]), Date.parse(dates[1])]}
    },
    limit: 5000
  }))
  console.log(JSON.stringify(response.data.listMpsSubscriptions.items.length))
  return response.data.listMpsSubscriptions.items
})

// ** Load Subscriptions
export const loadData = createAsyncThunk('appSubscriptions/loadData', async params => {
  const subscriptions = []
  const parsedData = ''

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
  subscriptions = await processAddresses(parsedData)
  console.log('DONE ' + JSON.stringify(subscriptions))
  return subscriptions
})


const processAddresses = async (addresses) => {
  console.log('to add0: ' + JSON.stringify(addresses[0].number))
  console.log('to add: ' + addresses)
  var results = []
  for (var i=0; i < addresses.length; i++) {
    if(i % 2 == 0) {
      const urlRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addresses[i].Address + '&key=AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo'
      await axios.get(urlRequest.replaceAll('#','n')).then(async (response) => {
        if(response.data.results.length > 0) {
          var newSubscription = {
            id: addresses[i].number,
            number: addresses[i].number,
            subscriptionDate: Date.now(),
            address: response.data.results[0].formatted_address,
            email: addresses[i].email,
            phone: addresses[i].phone,
            name: addresses[i].name,
            mealPlan: addresses[i + 1].name,
            latitude: response.data.results[0].geometry.location.lat,
            avatar: '',
            status: 'Actived',
            longitude: response.data.results[0].geometry.location.lng,
            deliveryInstruction: addresses[i + 1].Address
          }
          results.push(newSubscription)
          console.log('pushing: ' + JSON.stringify(newSubscription))
          await API.graphql(graphqlOperation(createMpsSubscription, {input: newSubscription}))
          console.log(response.data.results[0].geometry.location.lat, ',', response.data.results[0].geometry.location.lng)
        }
        else {
          console.log('error for: ' + urlRequest)
        }    
      }).catch(err => {
        console.log('CRITICAL ERROR: ' + JSON.stringify(err))
      })
    }
  }
  return results
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
      state.data = action.payload
      state.params = action.payload.params
      state.allData = action.payload
      state.total = action.payload.total
    })
    builder.addCase(loadData.fulfilled, (state, action) => {
      state.data = action.payload
      state.params = action.payload.params
      state.allData = action.payload
      state.total = action.payload.length
    })
  }
})

export default appSubscriptionSlice.reducer
