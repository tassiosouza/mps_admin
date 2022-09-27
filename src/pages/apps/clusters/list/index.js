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

  const initialPath = [
    { lat: 33.3047610128895, lng: -117.38569404687499},
    { lat: 33.17023062920513, lng: -117.4320085 },
    { lat: 33.168072587211924, lng: -117.20816206445312 },
    { lat: 33.31394248217619, lng: -117.2694606484375 }
  ]

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.clusters)

  useEffect(() => {
    dispatch(
      fetchClusters({
        q: value
      })
    )
  }, [dispatch, value])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBtiYdIofNKeq0cN4gRG7L1ngEgkjDQ0Lo"
  })

  // Store Polygon path in state
  const [path, setPath] = useState(initialPath);

  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      dispatch(updateCluster({nextPath}))
      setPath(nextPath)
    }
  }, [setPath]);

  // Bind refs to current Polygon and listeners
  const onLoad = useCallback(
    polygon => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
    setPath(initialPath)
  }, []);

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
                    clickable={false}
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
                    path={JSON.parse(cluster.path)}
                    onUnmount={onUnmount}
                    options={{
                      strokeColor:cluster.color,
                      fillColor:cluster.color,
                      strokeOpacity:"0.5",
                      strokeWeight:'2'
                    }}
                />
                ))}
                {store.editingCluster && (
                  <Polygon
                    // Make the Polygon editable / draggable
                    editable
                    draggable
                    path={path}
                    // Event used when manipulating and adding points
                    onMouseUp={onEdit}
                    // Event used when dragging the whole Polygon
                    onDragEnd={onEdit}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                      strokeColor:store.editingCluster.color,
                      fillColor:store.editingCluster.color,
                      strokeOpacity:"0.5",
                      strokeWeight:'2'
                    }}
                  />
                )}
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
