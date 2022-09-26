// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'


// ** Custom Components Imports
import ClustersList from 'src/views/apps/clusters/list/ClustersList'

// ** Script Hook Import
import { handleLoadingClusters, saveClustering } from 'src/store/apps/clusters'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters, updateCluster } from 'src/store/apps/clusters'

// ** Thrid Party Imports
import { Player } from '@lottiefiles/react-lottie-player';
import { GoogleMap, useJsApiLoader, Polygon, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '800px',
  height: '75vH',
  borderRadius:'8px'
};

const center = {
  lat: 33.3523247,
  lng:  -117.5310085
};

/* eslint-enable */
const ClustersPage = () => {

  // ** State
  const [value, setValue] = useState('')

  useEffect(() => {
    dispatch(
      fetchClusters({
        q: value
      })
    )
  }, [dispatch, value])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.clusters)

  const handleSave = () => {
    dispatch(handleLoadingClusters(true))
    dispatch(saveClustering({}))
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo"
  })

  const [map, setMap] = useState(null)

  const handleMouseUp = (event, index, polygon) => {
    const latLng = {lat:event.latLng.lat(), lng:event.latLng.lng()}
    var vertexIndex
    if(event.hasOwnProperty('vertex')) {
      vertexIndex = event.vertex
      
      var pathToUpdate = store.clusters[index].path.map((ll, index) => {
        if(index === vertexIndex) {
          return latLng
        }
        return ll
      })
      var clusterToUpdate = {...store.clusters[index], path: pathToUpdate}
      dispatch(updateCluster({cluster: clusterToUpdate}))
    }
    else if(event.hasOwnProperty('edge')) {
      vertexIndex = event.edge + 1
      var pathToUpdate = [...store.clusters[index].path]
      pathToUpdate.splice(vertexIndex, 0, latLng)
      var clusterToUpdate = {...store.clusters[index], path: pathToUpdate}
      dispatch(updateCluster({cluster: clusterToUpdate}))
    }
  }

  const onMouseDown = (event) => {
    console.log('down: ' + JSON.stringify(event))
  }

  const onLoad = polygon => {
    console.log("polygon: ", polygon);
  }

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={5}>
        <ClustersList 
          store={store}
        />
      </Grid>
      <Grid item xs={7}>
          {!store.loading ? 
            <div className="App">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={8.52}
                  onUnmount={onUnmount}
                >
                {store.subscriptions.map((subscription, index) => (
                  <Marker
                    key={index}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: subscription.color,
                      fillOpacity: 0.5,
                      scale: 3,
                      strokeColor: subscription.color,
                      strokeWeight: 1,
                    }}
                    position={{ lat: subscription.latitude, lng: subscription.longitude }}
                  />
                ))}
                {store.clusters.map((cluster, index) => (
                  <Polygon
                    onLoad={onLoad}
                    key={index}
                    editable
                    path={cluster.path}
                    onMouseUp={e => handleMouseUp(e, index)}
                    onMouseDown={e => onMouseDown(e)}
                    onUnmount={onUnmount}
                    options={{
                      strokeColor:cluster.color,
                      fillColor:cluster.color,
                      strokeOpacity:"0.5",
                      strokeWeight:'2'
                    }}
                />
                ))}
                </GoogleMap>
            ) : <></>
              }</div> :
            (
            <Player
              autoplay
              loop
              src={"https://lottie.host/6eb020bd-6373-4d44-8ed2-cf91e4608541/W9w8TNzZz8.json"}
              style={{ height: '550px', width: '850px'}}
              >
            </Player>
            )
          }
      </Grid>
    </Grid>
  )
}

export default ClustersPage
