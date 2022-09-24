// ** React Imports
import { Fragment, useState, useEffect, forwardRef, useCallback, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'

// ** Custom Components Imports
import ClustersList from 'src/views/apps/clusters/list/ClustersList'
import ListHeader from 'src/views/apps/clusters/list/ListHeader'

// ** Script Hook Import
import useScript from 'src/hooks/useScript'
import { handleLoadingClusters, saveClustering } from 'src/store/apps/clusters'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters } from 'src/store/apps/clusters'

// ** Thrid Party Imports
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';

const containerStyle = {
  width: '800px',
  height: '500px'
};

const center = {
  lat: 33.3523247,
  lng:  -117.5310085
};

/* eslint-enable */
const ClustersPage = () => {

  // ** State
  const [value, setValue] = useState('')
  const [path, setPath] = useState([
    { lat: 33.3047610128895, lng: -117.38569404687499},
    { lat: 33.17023062920513, lng: -117.4320085 },
    { lat: 33.168072587211924, lng: -117.20816206445312 },
    { lat: 33.31394248217619, lng: -117.2694606484375 }
  ]);

  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
      console.log('new path: ' + JSON.stringify(nextPath))
    }
  }, [setPath]);

  const onEdit2 = (object) => {
    console.log(JSON.stringify(object))
  }

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

  const onLoad = useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={5}>
      {!store.loading ?
        (
          <ClustersList 
            store={store}
          />
        ) :
        (
          <Typography>Loading Clusters...</Typography>
        )
      }
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
                  <Polygon
                    // Make the Polygon editable / draggable
                    editable
                    draggable
                    path={path}
                    // Event used when manipulating and adding points
                    onMouseUp={onEdit2}
                    // Event used when dragging the whole Polygon
                    onDragEnd={onEdit2}
                    onUnmount={onUnmount}
                    options={{
                      strokeColor:"#d34052",
                      fillColor:"#d34052",
                      strokeOpacity:"0.5",
                      strokeWeight:'2'
                    }}
                  />
                  <></>
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
