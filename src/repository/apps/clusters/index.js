// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createCluster, updateMpsSubscription } from '../../../graphql/mutations'
import { listClusters, listMpsSubscriptions } from '../../../graphql/queries'

// ** Third Party Imports
import Supercluster from 'supercluster';
import uuid from 'react-uuid';
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

const getPointsFromSubscriptions = (subscriptions) => {
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

  // const index = new Supercluster({
  //   radius: 40,
  //   maxZoom: 8,
  // });
  // var points = getPointsFromSubscriptions(subscriptionsToUpdate)
  // index.load(points);
  // const superClusterResult = index.getClusters([-180, -90, 180, 90], 3 + parentCluster.level);

  const ghBody = getGraphHopperClusterRequestBody(subscriptionsToUpdate)
  const res = await axios.post('https://graphhopper.com/api/1/cluster?key=110bcab4-47b7-4242-a713-bb7970de2e02', ghBody)
  
  const {newClusters, updatedSubscriptions} = updateSubscriptions(res, parentCluster, subscriptions)

  return {newClusters, updatedSubscriptions}
}

const updateSubscriptions = (res, parentCluster, subscriptions) => {
  var newClusters = []
  var updatedSubscriptions = []
  for(var i = 0; i < res.data.clusters.length; i++) {
    const currentCluster = res.data.clusters[i]
    // ** Create amplify Cluster for each generated cluster
    const subsIds = currentCluster.ids
    if(subsIds.length) {
      const cluster = {
        id: uuid(),
        name: 'Child Cluster #' + i,
        parentId:parentCluster.id,
        color: "#" + ((1<<24)*Math.random() | 0).toString(16),
        level: parentCluster.level + 1,
        open: false,
        subscriptionsCount: subsIds.length,
        editing: true
      }
      newClusters.push(cluster)

      for(var k = 0; k < subsIds.length; k ++) {
        var sub = subscriptions.find(sub => sub.id === subsIds[k])
        if(sub) {
          updatedSubscriptions.push({...sub, editing:true, clusterId:cluster.id})
        }
      }
    }
  }

  return {newClusters, updatedSubscriptions}
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
      "max_quantity": subscriptions.length,
      "min_quantity": 80
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