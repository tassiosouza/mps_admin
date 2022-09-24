// ** Axios Imports
import axios from 'axios'

// ** Third Party Imports
import Papa from "papaparse";

// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createMpsSubscription, updateMpsSubscription } from '../../../graphql/mutations'
import { listMpsSubscriptions, getMpsSubscription } from '../../../graphql/queries'
import { SubscriptionStatus } from '../../../models'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

export const getSubscriptions =  async params  => {
  const {status, location, dates, q} = params
  
  const filter = status ? {
    status: {
      eq: status
    },
    address: {
      contains: location != '' ? location : ','
    }
  } : {
    address: {
      contains: location != '' ? location : ','
    }
  }

  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    filter,
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
}

// ** Load Subscriptions
export const loadSubscriptions = async (params, getState)  => {
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
  subscriptions = await syncSubscriptions(parsedData, oldSubscriptions, params.callback)
  return subscriptions
}


const syncSubscriptions = async (parsedData, oldSubscriptions, callback) => {
  var synced = []
  var toCancel = []
  var toInclude = []
  var toUpdate = []
  var updated = []
  var included = []
  var canceled = []
  var newSubscriptions = []
  var failed = []
  var errorMessage = ''

  for (var i= 0; i < parsedData.length; i++) {
    if(i % 2 == 0) {
      newSubscriptions.push({
        id: parsedData[i].number + parsedData[i].name,
        number: parsedData[i].number,
        subscriptionDate: Date.now(),
        address: parsedData[i].Address,
        location: '',
        email: parsedData[i].email,
        phone: parsedData[i].phone,
        name: parsedData[i].name,
        mealPlan: parsedData[i + 1].name,
        latitude: 0,
        avatar: '',
        status: SubscriptionStatus.ACTIVED,
        longitude: 0,
        deliveryInstruction: parsedData[i + 1].Address,
        clusterId: 'root',
        editing: false
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

  toUpdate = newSubscriptions.filter(subscription => {
    const matchSubscription = null
    for(var i = 0; i < oldSubscriptions.length; i++) {
      if(oldSubscriptions.length) {
        if((oldSubscriptions[i].number + oldSubscriptions[i].name) == (subscription.number + subscription.name))
        {
          matchSubscription = oldSubscriptions[i]
          break
        }
      }
    }
    
    if(matchSubscription) {
      var addressName = matchSubscription.address.split(',')[0].split(' ')
      var mainAddress = addressName[0]
      // ** Check if the registered order has different address or status
      return !subscription.address.toLowerCase().includes(mainAddress.toLowerCase()) || matchSubscription.status === 'Canceled'
    }
    return false
  })

  toCancel = oldSubscriptions.filter(subscription => {
    return !newSubscriptionsNumber.includes(subscription.number + subscription.name) && subscription.status === 'Actived'
  });

  toInclude = newSubscriptions.filter(subscription => {
    return !oldSubscriptionsNumber.includes(subscription.number + subscription.name)
  });

  if(oldSubscriptions.length > -1) {
    for(var i = 0; i < toInclude.length; i++) {
      if(errorMessage != '') break
      const urlRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + toInclude[i].address + '&key=AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo'
        await axios.get(urlRequest.replaceAll('#','n')).then(async (response) => {
          if(response.data.results.length > 0) {
            const locality = response.data.results[0].address_components.filter(ac => ac.types.includes('locality'))
            toInclude[i].address = response.data.results[0].formatted_address
            toInclude[i].latitude = response.data.results[0].geometry.location.lat
            toInclude[i].longitude = response.data.results[0].geometry.location.lng
            toInclude[i].location = locality[0].long_name,
            await API.graphql(graphqlOperation(createMpsSubscription, {input: toInclude[i]}))
            console.log(response.data.results[0].geometry.location.lat, ',', response.data.results[0].geometry.location.lng)
            included.push(toInclude[i])
          }
          else {
            failed.push(toInclude[i])
            errorMessage = 'SYNC OPERATION: CREATE: Error when processing order id: ' + toInclude[i].number 
            console.log('error for: ' + JSON.stringify(toInclude[i]))
          }    
        }).catch(err => {
          // errorMessage = 'SYNC OPERATION: CREATE: Error when processing order id: ' + toInclude[i].number 
          failed.push(toInclude[i])
          console.log('CRITICAL ERROR: ' + JSON.stringify(err))
        })
    }

    for(var i = 0; i < toUpdate.length; i++) {
      if(errorMessage != '') break
        const urlRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + toUpdate[i].address + '&key=AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo'
        await axios.get(urlRequest.replaceAll('#','n')).then(async (response) => {
          if(response.data.results.length > 0) {
            const itemQuery = await API.graphql(graphqlOperation(getMpsSubscription, toUpdate[i]))
            const version = itemQuery.data.getMpsSubscription._version
            const locality = response.data.results[0].address_components.filter(ac => ac.types.includes('locality'))

            const versionedSub = {
              id: toUpdate[i].number + toUpdate[i].name,
              number: toUpdate[i].number,
              subscriptionDate: toUpdate[i].subscriptionDate,
              address: response.data.results[0].formatted_address,
              location: locality[0].long_name,
              email: toUpdate[i].email,
              phone: toUpdate[i].phone,
              name: toUpdate[i].name,
              mealPlan: toUpdate[i].mealPlan,
              latitude: response.data.results[0].geometry.location.lat,
              avatar: toUpdate[i].avatar,
              status: 'Actived',
              longitude: response.data.results[0].geometry.location.lng,
              deliveryInstruction: toUpdate[i].deliveryInstruction,
              _version: version
            }
            await API.graphql(graphqlOperation(updateMpsSubscription, {input: versionedSub}))
            console.log(response.data.results[0].geometry.location.lat, ',', response.data.results[0].geometry.location.lng)
            updated.push(versionedSub)
          }
          else {
            errorMessage = 'SYNC OPERATION: UPDATE: Error when processing order id: ' + toUpdate[i].number 
            failed.push(toUpdate[i])
            console.log('error for: ' + urlRequest)
          }    
        }).catch(err => {
          errorMessage = 'SYNC OPERATION: UPDATE: Error when processing order id: ' + toUpdate[i].number 
          failed.push(toUpdate[i])
          console.log('CRITICAL ERROR: ' + err)
          console.log('CRITICAL ERROR: ' + JSON.stringify(err))
        })
    }
    for(var i = 0; i < toCancel.length; i ++) {
      if(errorMessage != '') break
      try {
        const itemQuery = await API.graphql(graphqlOperation(getMpsSubscription, toCancel[i]))
        const version = itemQuery.data.getMpsSubscription._version
        const versionedSub = {
          id: toCancel[i].number + toCancel[i].name,
          number: toCancel[i].number,
          subscriptionDate: toCancel[i].subscriptionDate,
          address: toCancel[i].address,
          email: toCancel[i].email,
          phone: toCancel[i].phone,
          name: toCancel[i].name,
          mealPlan: toCancel[i].mealPlan,
          latitude: toCancel[i].latitude,
          avatar: toCancel[i].avatar,
          status: 'Canceled',
          longitude: toCancel[i].longitude,
          deliveryInstruction: toCancel[i].deliveryInstruction,
          _version: version
      }
      await API.graphql(graphqlOperation(updateMpsSubscription, {input: versionedSub}))
      canceled.push(versionedSub)
      }
      catch(err) {
          errorMessage = 'SYNC OPERATION: CANCEL: Error when processing order id: ' + toCancel[i].number 
          failed.push(toCancel[i])
          console.log('CRITICAL ERROR: ' + err)
          console.log('CRITICAL ERROR: ' + JSON.stringify(err))
      }
    }
  }
  else {
    synced = []
    toCancel = []
    toInclude = []
    included = []
    newSubscriptions = []
    failed = []
  }
  
  return {synced, toCancel, included, failed, toUpdate, oldSubscriptions, canceled, errorMessage, callback}
}