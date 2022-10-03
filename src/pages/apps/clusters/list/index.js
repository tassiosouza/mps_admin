// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'


// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import Broadcast from 'mdi-material-ui/Broadcast'
import BroadcastOff from 'mdi-material-ui/BroadcastOff'


// ** Custom Components Imports
import ClustersList from 'src/views/apps/clusters/list/ClustersList'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters, updateCluster, handleHover} from 'src/store/apps/clusters'

// ** Thrid Party Imports
import { Player } from '@lottiefiles/react-lottie-player';
import { GoogleMap, useJsApiLoader, Polygon, Marker, MarkerClusterer, useGoogleMap} from '@react-google-maps/api';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const containerStyle = {
  width: '800px',
  height: '75vH',
  borderRadius:'8px'
};

/* eslint-enable */
const ClustersPage = () => {

  // ** State
  const [value, setValue] = useState('')
  const [showSubscriptions, setShowSubscriptions] = useState(true)
  const [showClustering, setShowClustering] = useState(true)

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

  useEffect(() => {
    if(store.editingCluster != null) {
      if(store.editingCluster.path) {
        setPath(store.editingCluster.path)
      } else {
        setPath(initialPath)
      }
    }
  }, [store])

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

  const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }

  const MapControl = ({ position, children, zIndex = 0 }) => {
    const map = useGoogleMap();
  
    const [container] = useState(document.createElement('div'));
  
    useEffect(() => {
      const controlsContainer = map.controls[position];
  
      controlsContainer.push(container);
  
      return () => {
        const index = controlsContainer.indexOf(container);
        if (index !== -1) {
          controlsContainer.removeAt(index);
        }
      };
    }, [map]);
  
    useEffect(() => {
      container.style.zIndex = zIndex;
    }, [zIndex]);
  
    return createPortal(children, container);
  };

  MapControl.propTypes = {
    position: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    zIndex: PropTypes.number,
  };

  const isClusterEditing = (id) => {
    if(store.editingCluster) {
      return store.editingCluster.id === id
    }
    
    return false
  }

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
                  center={store.currentCenter}
                  zoom={store.currentZoom}
                  onUnmount={onUnmount}
                >
                <MapControl position={window.google.maps.ControlPosition.TOP_LEFT}>
                  <Button 
                    variant='contained'
                    startIcon={showSubscriptions ? <EyeOffOutline sx={{ml:2.5}}/> : <EyeOutline sx={{ml:2.5}}/> }
                    sx={{backgroundColor:"#fff", color:"#000", borderRadius:0.2, mt:2.5}}
                    onClick={() => setShowSubscriptions(!showSubscriptions)}/>
                  {showSubscriptions && <Button 
                    variant='contained'
                    startIcon={showClustering ? <BroadcastOff sx={{ml:2.5}}/> : <Broadcast sx={{ml:2.5}}/> }
                    sx={{backgroundColor:"#fff", color:"#000", borderRadius:0.2, mt:2.5}}
                    onClick={() => setShowClustering(!showClustering)}/>}
                </MapControl>
                {showClustering && showSubscriptions && (
                  <MarkerClusterer 
                    clickable={false}
                    options={options}>
                    {(clusterer) =>
                    <>
                      {store.subscriptions.map((subscription, index) => (
                        <Marker
                          key={index}
                          clickable={false}
                          icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: subscription.color,
                            fillOpacity: 0.5,
                            scale: 6,
                            strokeColor: subscription.color,
                            strokeWeight: 1,
                          }}
                          clusterer={clusterer}
                          position={{ lat: subscription.latitude, lng: subscription.longitude }}
                        />  
                      ))}
                      </>
                    }
                  </MarkerClusterer>
                )}
                {store.subscriptions.map((subscription, index) => (
                    <Marker
                      visible={!showClustering && showSubscriptions}
                      onClick={() => console.log(subscription.number)}
                      key={index}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#363636',
                        fillOpacity: 0.5,
                        scale: 3,
                        marginTop:3,
                        strokeColor: subscription.color,
                        strokeWeight: 1,
                      }}     
                      position={{ lat: subscription.latitude, lng: subscription.longitude }}
                    />  
                  ))}
                {store.clusters.map((cluster, index) => (
                  <Polygon
                    visible={!isClusterEditing(cluster.id)}
                    clickable={true}
                    onLoad={onLoad}
                    key={index}
                    path={cluster.path}
                    onUnmount={onUnmount}
                    options={{
                      strokeColor:cluster.hover ? cluster.color : '#363636',
                      fillColor: store.selectedClusters.includes(cluster) ? cluster.color : '#363636',
                      strokeOpacity:cluster.hover ? '0.5' : '0.8',
                      strokeWeight:cluster.hover ? '2' : '1'
                    }}
                />
                ))}
                {store.editingCluster && (
                  <Polygon
                    editable
                    draggable
                    path={path}
                    onMouseUp={onEdit}
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
