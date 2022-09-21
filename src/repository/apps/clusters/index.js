// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createCluster, updateMpsSubscription } from '../../../graphql/mutations'
import { listClusters, listMpsSubscriptions } from '../../../graphql/queries'

// ** Axios Party Imports
import axios from 'axios'
import Supercluster from 'supercluster';

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

const generateRandomPlaces = (subscriptions) => {
  var points = []
  for (var i = 0; i < subscriptions.length; i++) {
    points.push({
      type: "Feature",
      properties: {
        index: i,
        id:subscriptions[i].id
      },
      geometry: {
        type: "Point",
        coordinates: [subscriptions[i].latitude, subscriptions[i].longitude]
      }
    })
  }
  return points
}

// ** Update root cluster in Amplify
export const addClusters =  async (parentCluster, subscriptions)  => {
  // ** Retreive subscriptions to update
  const subscriptionsToUpdate = subscriptions.filter(sub => sub.clusterId === parentCluster.id)

  const index = new Supercluster({
    radius: 40,
    maxZoom: 8,
  });
  var points = generateRandomPlaces(subscriptionsToUpdate)
  index.load(points);
  const results = index.getClusters([-180, -90, 180, 90], 3 + parentCluster.level);
  
  await updateSubscriptions(results, index, parentCluster)
}

const updateSubscriptions = async (clusters, index, parentCluster) => {
  for(var i = 0; i < clusters.length; i++) {
    // ** Create amplify Cluster for each generated cluster
    const subs = index.getLeaves(clusters[i].id, 1000,0)
    if(subs.length) {
      const response = await API.graphql(graphqlOperation(createCluster, {
        input: {
          name: 'Child Cluster #' + i,
          parentId:parentCluster.id,
          color: "#" + ((1<<24)*Math.random() | 0).toString(16),
          level: parentCluster.level + 1,
          open: false,
          subscriptionsCount: subs.length
        }
      }))
      const amplifyCluster = response.data.createCluster
      
      for(var k = 0; k < subs.length; k ++) {
        await API.graphql(graphqlOperation(updateMpsSubscription, {
          input: {
            id: subs[k].properties.id,
            clusterId: amplifyCluster.id
          }
        }))
      }
    }
  }
}

const getGraphHopperClusterRequestBody = (subscriptions) => {
  const factor = 2
  const configuration = {
    "response_type": "json",
    "routing": {
      "profile": "as_the_crow_flies",
      "cost_per_second":0,
      "cost_per_meter":1
    },
    "clustering": {
      "num_clusters": factor, 
      "max_quantity": subscriptions.length/factor,
      "min_quantity": 1
    }
  }
  const customers = []

  subscriptions.map(sub => {
    customers.push({
      id: sub.id,
      address: {
        lon: sub.longitude,
        lat: sub.latitude,
        street_hint:'teste'
      },
      quantity:1
    })
  })

  var body = {
    configuration,
    customers,
  }
  return body
}