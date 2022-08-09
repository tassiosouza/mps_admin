import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { Console, CosineWave } from 'mdi-material-ui';

// ** Third Party Imports
import Papa from "papaparse";

// ** Fetch Subscriptions
export const fetchData = createAsyncThunk('appSubscriptions/fetchData', async params => {
  const response = await axios.get('/apps/subscriptions/subscription', {
    params
  })
  
  return response.data
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
  // const now = new Date()
  // const currentMonth = now.toLocaleString('default', { month: 'short' })
  // const currentDay = now.toLocaleString('default', { day: 'short' })
  console.log('to add0: ' + JSON.stringify(addresses[0].number))
  console.log('to add: ' + addresses)
  var results = []
  for (var i=0; i < addresses.length; i++) {
    if(i % 2 == 0 && i < 20) {
      const urlRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addresses[i].Address + '&key=AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo'
      await axios.get(urlRequest.replaceAll('#','n')).then((response) => {
        if(response.data.results.length > 0) {
          results.push({
            id: addresses[i].number,
            subscriptionDate: '20/04/2022',
            address: addresses[i].Address,
            email: addresses[i].email,
            country: 'USA',
            phone: addresses[i].phone,
            name: addresses[i].name,
            mealPlan: addresses[i + 1].name,
            latitude: response.data.results[0].geometry.location.lat,
            avatar: '',
            avatarColor: 'primary',
            status: 'Actived',
            longitude: response.data.results[0].geometry.location.lng,
            deliveryInstructions: addresses[i + 1].Address
          })
          console.log(response.data.results[0].geometry.location.lat, ',', response.data.results[0].geometry.location.lng)
        }
        else {
          console.log('error for: ' + urlRequest)
        }    
      }).catch(err => {
        console.log('CRITICAL ERROR: ' + err)
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

export const appSubscriptionSlice = createSlice({
  name: 'appSubscriptions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      // state.data = action.payload.subscriptions
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
    builder.addCase(loadData.fulfilled, (state, action) => {
      console.log(JSON.stringify(action))
      state.data = action.payload
      state.params = action.payload.params
      state.allData = action.payload
      state.total = action.payload.length
    })
  }
})

export default appSubscriptionSlice.reducer
