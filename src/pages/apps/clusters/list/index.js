// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from 'react'

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
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import ClustersList from 'src/views/apps/clusters/list/ClustersList'

// ** Script Hook Import
import useScript from 'src/hooks/useScript'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters } from 'src/store/apps/clusters'

// ** Thrid Party Imports
import { Player, Controls } from '@lottiefiles/react-lottie-player';

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

  const MapKit = () => {
    useScript('/scripts/mapkit-clusters.js')
  }

  const divStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '55vW',
    height: '75vH',
  }
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={5}>
        <Card>
          <CardHeader title='Clusters' />
          {store.loading && <LinearProgress sx={{ height:'2px' }} />}
          <CardContent>
            {!store.loading ?
              (
                <ClustersList 
                  clusters={store.clusters}
                  subscriptions={store.subscriptions}
                />
              ) :
              (
                <Typography>Clustering in progress...</Typography>
              )
            }
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={7}>
          {!store.loading ? 
            <div 
              id="map"
              style={divStyle}
              clusters={JSON.stringify(store.clusters)}
              subscriptions={JSON.stringify(store.subscriptions)}
              >
                <MapKit/>
            </div> :
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
