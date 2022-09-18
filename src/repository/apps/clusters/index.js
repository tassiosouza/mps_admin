// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { updateCluster } from '../../../graphql/mutations'
import { listClusters, listMpsSubscriptions } from '../../../graphql/queries'

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

// ** Update root cluster in Amplify
export const updateRootCluster =  async (cluster)  => {
  delete cluster.createdAt
  delete cluster.updatedAt
  console.log('new cluster: ' + JSON.stringify(cluster))
  const response = await API.graphql(graphqlOperation(updateCluster, {
    input: cluster
  }))
  const data = response.data.updateCluster.items
  return data
}