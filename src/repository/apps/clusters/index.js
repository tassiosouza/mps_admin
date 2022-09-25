// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createCluster, updateMpsSubscription } from '../../../graphql/mutations'
import { listClusters, listMpsSubscriptions } from '../../../graphql/queries'

// ** Third Party Imports
import axios from 'axios'

// ** Fetch Clusters from Amplify
export const getClusters =  async params  => {
  const { q } = params
  const response = await API.graphql(graphqlOperation(listClusters, {
    limit: 5000
  }))
  const queryLowered = q.toLowerCase()
  const filteredData = response.data.listClusters.items.filter(cluster => {
    return (
      cluster.name.toLowerCase().includes(queryLowered)
    )
  })
  return filteredData
}

// ** Fetch ALL Subscriptions from Amplify
export const getSubscriptions =  async()  => {
  const response = await API.graphql(graphqlOperation(listMpsSubscriptions, {
    limit: 5000
  }))
  const data = response.data.listMpsSubscriptions.items
  return data
}

// ** Save ALL editing clusters and subscriptions in Amplify
export const saveClustersAndSubscriptions =  async(subscriptions, clusters)  => {
  // ** Update editing subscriptions
  for(var i = 0; i < subscriptions.length; i++) {
    if(subscriptions[i].editing) {
      await API.graphql(graphqlOperation(updateMpsSubscription, {
        input: {id: subscriptions[i].id, clusterId: subscriptions[i].clusterId, editing: false}
      }))
    }
  }
  // ** Save editing clusters
  for(var i = 0; i < clusters.length; i++) {
    if(clusters[i].editing) {
      await API.graphql(graphqlOperation(createCluster, {
        input: {...clusters[i], editing: false}
      }))
    }
  }
}

// ** Update root cluster in Amplify
export const addClusterLocally =  async (cluster, subscriptions)  => {
  // ** Retreive subscriptions to update based on inside clusters
  const subscriptionsToUpdate = subscriptions
  
  const updatedSubscriptions = updateSubscriptions(cluster, subscriptionsToUpdate)

  return updatedSubscriptions
}

const updateSubscriptions = (cluster, subscriptions) => {
  var updatedSubscriptions = subscriptions.map(sub => {
      return {...sub, editing:true, clusterId:cluster.id, color:cluster.color}
  })
  return updatedSubscriptions
}