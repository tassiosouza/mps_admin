// ** Amplify Imports
import { API, graphqlOperation } from 'aws-amplify'
import { createCluster, updateMpsSubscription, updateCluster, deleteCluster } from '../../../graphql/mutations'
import { listClusters, listMpsSubscriptions } from '../../../graphql/queries'

// ** Fetch Clusters from Amplify
export const getClusters = async params => {
  const { q } = params
  const response = await API.graphql(
    graphqlOperation(listClusters, {
      limit: 5000
    })
  )
  const queryLowered = q.toLowerCase()
  const filteredData = response.data.listClusters.items.filter(cluster => {
    return cluster.name.toLowerCase().includes(queryLowered)
  })
  return filteredData
}

// ** Fetch ALL Subscriptions from Amplify
export const getSubscriptions = async () => {
  var subscriptions = []
  var nextToken = null
  for (var i = 0; i < 10; i++) {
    const subsResponse = await API.graphql(
      graphqlOperation(listMpsSubscriptions, {
        nextToken,
        limit: 5000
      })
    )
    subscriptions = [...subscriptions, ...subsResponse.data.listMpsSubscriptions.items]
    nextToken = subsResponse.data.listMpsSubscriptions.nextToken

    if (nextToken == null) break
  }
  return subscriptions
}

// ** Delete Clusters from Amplify
export const deleteRemoteClusters = async (clusters, subscriptions) => {
  for (var i = 0; i < subscriptions.length; i++) {
    await API.graphql(
      graphqlOperation(updateMpsSubscription, {
        input: { id: subscriptions[i].id, clusterId: '', color: '#363636' }
      })
    )
  }

  for (var i = 0; i < clusters.length; i++) {
    await API.graphql(
      graphqlOperation(deleteCluster, {
        input: { id: clusters[i].id }
      })
    )
  }
}

// ** Recalculate Clusters from Amplify
export const recalculateRemoteClusters = async (clusters, subscriptions) => {
  for (var i = 0; i < clusters.length; i++) {
    const polygon = []
    for (var k = 0; k < clusters[i].path.length; k++) {
      polygon.push([clusters[i].path[k].lng, clusters[i].path[k].lat])
    }

    var updatedSubscriptions = subscriptions.map(sub => {
      var point = [sub.longitude, sub.latitude]
      if (pointInPolygon(polygon, point)) {
        return { ...sub, editing: true }
      }
      return sub
    })

    const insideClusterSubscriptions = updatedSubscriptions.filter(s => s.editing)

    await API.graphql(
      graphqlOperation(updateCluster, {
        input: { id: clusters[i].id, subscriptionsCount: insideClusterSubscriptions.length }
      })
    )

    for (var k = 0; k < insideClusterSubscriptions.length; k++) {
      await API.graphql(
        graphqlOperation(updateMpsSubscription, {
          input: {
            id: insideClusterSubscriptions[k].id,
            editing: false,
            clusterId: clusters[i].id,
            color: clusters[i].color
          }
        })
      )
    }
  }
}

// ** Save ALL editing clusters and subscriptions in Amplify
export const saveClustersAndSubscriptions = async (subscriptions, cluster) => {
  const subscriptionsCount = subscriptions.filter(sub => sub.clusterId === cluster.id).length

  // ** Update editing subscriptions
  for (var i = 0; i < subscriptions.length; i++) {
    if (subscriptions[i].editing) {
      await API.graphql(
        graphqlOperation(updateMpsSubscription, {
          input: {
            id: subscriptions[i].id,
            clusterId: subscriptions[i].clusterId,
            color: subscriptions[i].color,
            editing: false
          }
        })
      )
    }
  }
  // ** Save editing clusters
  if (cluster.editing) {
    if (cluster.new) {
      await API.graphql(
        graphqlOperation(createCluster, {
          input: {
            id: cluster.id,
            name: cluster.name,
            editing: false,
            path: JSON.stringify(cluster.path),
            color: cluster.color,
            subscriptionsCount: subscriptionsCount,
            minBags: cluster.minBags,
            maxBags: cluster.maxBags
          }
        })
      )
    } else {
      console.log('being updating: ' + JSON.stringify(cluster))
      await API.graphql(
        graphqlOperation(updateCluster, {
          input: {
            id: cluster.id,
            name: cluster.name,
            editing: false,
            path: JSON.stringify(cluster.path),
            color: cluster.color,
            subscriptionsCount: subscriptionsCount,
            minBags: cluster.minBags,
            maxBags: cluster.maxBags
          }
        })
      )
    }
  }
}

const updateSubscriptions = (cluster, subscriptions) => {
  const polygon = []
  for (var i = 0; i < cluster.path.length; i++) {
    polygon.push([cluster.path[i].lng, cluster.path[i].lat])
  }
  var updatedSubscriptions = subscriptions.map(sub => {
    var point = [sub.longitude, sub.latitude]
    if (pointInPolygon(polygon, point)) {
      if (sub.clusterId === '') {
        return { ...sub, editing: true, clusterId: cluster.id, color: cluster.color }
      }
    } else if (sub.clusterId === cluster.id) {
      return { ...sub, editing: true, clusterId: '', color: '#363636' }
    }
    return sub
  })
  return updatedSubscriptions
}

// ** Update cluster and subscriptions locally
export const updateClusterLocally = async (cluster, subscriptions) => {
  // ** Update subscriptions based on inside clusters
  const updatedSubscriptions = updateSubscriptions(cluster, subscriptions)
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
  let odd = false
  //For each edge (In this case for each point of the polygon and the previous one)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
    //If a line from the point into infinity crosses this edge
    if (
      polygon[i][1] > point[1] !== polygon[j][1] > point[1] && // One point needs to be above, one below our y coordinate
      // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
      point[0] <
        ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]
    ) {
      // Invert odd
      odd = !odd
    }
    j = i
  }
  //If the number of crossings was odd, the point is in the polygon
  return odd
}
