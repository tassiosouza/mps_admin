// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import Collapse from '@mui/material/Collapse'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import SendClock from 'mdi-material-ui/SendClock'
import Numeric0BoxOutline from 'mdi-material-ui/Numeric0BoxOutline'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import ClockOutline from 'mdi-material-ui/ClockOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import Plus from 'mdi-material-ui/Plus'
import Numeric1BoxMultiple from 'mdi-material-ui/Numeric1BoxMultiple'
import Numeric2BoxMultiple from 'mdi-material-ui/Numeric2BoxMultiple'
import Numeric3BoxMultiple from 'mdi-material-ui/Numeric3BoxMultiple'
import Numeric4BoxMultiple from 'mdi-material-ui/Numeric4BoxMultiple'
import Numeric5BoxMultiple from 'mdi-material-ui/Numeric5BoxMultiple'
import Numeric6BoxMultiple from 'mdi-material-ui/Numeric6BoxMultiple'
import Numeric7BoxMultiple from 'mdi-material-ui/Numeric7BoxMultiple'
import Numeric8BoxMultiple from 'mdi-material-ui/Numeric8BoxMultiple'
import Numeric9BoxMultiple from 'mdi-material-ui/Numeric9BoxMultiple'
import Numeric9PlusBoxMultiple from 'mdi-material-ui/Numeric9PlusBoxMultiple'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import CreateClusterDialog from './CreateClusterDialog'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import Check from 'mdi-material-ui/Check'
import CallSplit from 'mdi-material-ui/CallSplit'
import CircleMedium from 'mdi-material-ui/CircleMedium'


// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { handleSetOpenCluster } from 'src/store/apps/clusters'
import { createClusters, handleLoadingClusters } from 'src/store/apps/clusters'

import { arrayToTree } from "performant-array-to-tree";

const ClusterActions = (props) => {

  const {cluster, handleClusterSplit} = props

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!cluster.children.length && <CircleMedium sx={{color:cluster.color}}/>}
      <Box sx={{contentVisibility: cluster.children.length ? 'visible' : 'hidden', alignSelf:'end'}}>{cluster.open ? <ChevronUp /> : <ChevronDown />}</Box>
      <div>
        <IconButton size='small' component='a' sx={{ textDecoration: 'none' }} onClick={handleClick}>
          <DotsVertical/>
        </IconButton>
        <Menu keepMounted id='simple-menu' anchorEl={anchorEl} onClose={handleCloseMenu} open={Boolean(anchorEl)}>
            <MenuItem onClick={e => handleClusterSplit(e)} disabled={cluster.children.length}>
              <ListItemIcon sx={{mr: 0}}>
                <CallSplit fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Split' />
            </MenuItem>
            <MenuItem onClick={() => {}} disabled={cluster.level == 1}>
              <ListItemIcon sx={{mr: 0}}>
                <PencilOutline fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Edit' />
            </MenuItem>
            <MenuItem onClick={() => {}} disabled={cluster.level == 1}>
              <ListItemIcon sx={{mr: 0}}>
                <DeleteOutline fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </MenuItem>
        </Menu>
      </div>
    </Box>
  )
}

const ClustersList = props => {

  const { clusters, subscriptions } = props

  // ** State
  const [openCreateClusterDialog, setOpenCreateClusterDialog] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [clustersState, setClustersState] = useState([])

  useEffect(() => {
    setClustersState(formatClusters(clusters))
  },[clusters])
  
  // ** Convert the clusters flat array with parent ids into nested list
  const formatClusters = (clusters) => {
    const result = arrayToTree(clusters,
      { dataField: null }
    )
    return result
  }

  // ** Hooks
  const dispatch = useDispatch()

  // ** Functions
  const handleClick = (cluster) => {
    dispatch(handleSetOpenCluster(cluster))
  }

  const handleRename = (e, cluster) => {
    e.stopPropagation()
  }

  const handleCreate = (e, cluster) => {
    e.stopPropagation()
    dispatch(handleLoadingClusters(true))
    dispatch(createClusters({parentCluster: cluster, q:''}))
  }

  const handleCloseDialog = () => {
    setOpenCreateClusterDialog(false)
  }

  const NumericIcon = (count) => {
    switch(count) {
      case 0:
        return <Numeric0BoxOutline/>
      case 1:
        return <Numeric1BoxMultiple/>
      case 2:
        return <Numeric2BoxMultiple/>
      case 3:
        return <Numeric3BoxMultiple/>
      case 4:
        return <Numeric4BoxMultiple/>
      case 5:
        return <Numeric5BoxMultiple/>
      case 6:
        return <Numeric6BoxMultiple/>
      case 7:
        return <Numeric7BoxMultiple/>
      case 8:
        return <Numeric8BoxMultiple/>
      case 9:
        return <Numeric9BoxMultiple/>
      default:
        <Numeric9BoxMultiple/>
      break
    }
  }

  const ClusterNestedList = (clusters, open, deep) => {
    if(clusters != null) {
      return (
        <Collapse in={open} timeout='auto' unmountOnExit>
          {clusters.map(cluster => (
              <List component='div' disablePadding>
                <ListItem disablePadding>
                  <ListItemButton sx={{ pl: deep}} onClick={() => handleClick(cluster)}>
                    <ListItemIcon>
                      {NumericIcon(cluster.children.length)}
                    </ListItemIcon>
                    <ListItemText primary={cluster.name + " (" +  cluster.subscriptionsCount + ')'}/>
                    <Box sx={{display:'flex', justifyContent:'space-between', width:'4vW'}}>
                      <ClusterActions
                        cluster={cluster}
                        handleClusterSplit={e => handleCreate(e, cluster)}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
                {cluster.children && ClusterNestedList(cluster.children, cluster.open, deep + 4)}
              </List>
          ))}
        </Collapse>
      )
    }
  }

  return (
    <Grid>
      {clustersState.length && (ClusterNestedList(clustersState, true, 0))}
      <CreateClusterDialog 
        open={openCreateClusterDialog}
        onClose={handleCloseDialog}
        selectedCluster={selectedCluster}
        parent={clusters[0]}
      />
    </Grid>
  )
}

export default ClustersList
