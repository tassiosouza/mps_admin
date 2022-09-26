// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createCluster, updateMpsSubscription } from '../../../graphql/mutations'
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

// ** Update cluster and subscriptions locally
export const updateClusterLocally =  async (cluster, subscriptions)  => {
  // ** Retreive subscriptions to update based on inside clusters
  const polygon = []
  for(var i = 0; i< cluster.path.length; i++) {
    polygon.push([cluster.path[i].lng, cluster.path[i].lat])
  }

  const subscriptionsToUpdate = subscriptions.filter(sub => {
    var point = [sub.longitude, sub.latitude]
    return pointInPolygon(polygon, point)
  })
  
  const updatedSubscriptions = updateSubscriptions(cluster, subscriptionsToUpdate)

  return updatedSubscriptions
}

/**
 * Performs the even-odd-rule Algorithm (a raycasting algorithm) to find out whether a point is in a given polygon.
 * This runs in O(n) where n is the number of edges of the polygon.
 *
 * @param {Array} polygon an array representation of the polygon where polygon[i][0] is the x Value of the i-th point and polygon[i][1] is the y Value.
 * @param {Array} point   an array representation of the point where point[0] is its x Value and point[1] is its y Value
 * @return {boolean} whether the point is in the polygon (not on the edge, just turn < into <= and > into >= for that)
 */
 const pointInPolygon = function (polygon, point) {
  //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
  let odd = false;
  //For each edge (In this case for each point of the polygon and the previous one)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      //If a line from the point into infinity crosses this edge
      if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
          // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
          && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
          // Invert odd
          odd = !odd;
      }
      j = i;

  }
  //If the number of crossings was odd, the point is in the polygon
  return odd;
};

