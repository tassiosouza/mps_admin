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

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import SendClock from 'mdi-material-ui/SendClock'
import Numeric0BoxOutline from 'mdi-material-ui/Numeric0BoxOutline'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import ClockOutline from 'mdi-material-ui/ClockOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import Plus from 'mdi-material-ui/Plus'
import Numeric2BoxMultiple from 'mdi-material-ui/Numeric2BoxMultiple'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import CreateClusterDialog from './CreateClusterDialog'

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { handleSetOpenCluster } from 'src/store/apps/clusters'

import { arrayToTree } from "performant-array-to-tree";

const ClustersList = props => {

  const { clusters, subscriptions } = props

  // ** State
  const [openCreateClusterDialog, setOpenCreateClusterDialog] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [clustersState, setClustersState] = useState([])

  useEffect(() => {
    setClustersState(formatClusters(clusters))
  },[clusters])
  
  const formatClusters = (clusters) => {

    const result = arrayToTree(clusters,
      { dataField: null }
    )

    console.log('result: ' + JSON.stringify(result))

    return result
  }

  // ** Hooks
  const dispatch = useDispatch()

  // ** Functions
  const handleClick = (cluster) => {
    dispatch(handleSetOpenCluster(cluster))
  }

  const getSubscriptionsCount = clusterID => {
    return subscriptions.filter(sub => sub.clusterId === clusterID).length
  }

  const handleRename = (e, cluster) => {
    e.stopPropagation()
  }

  const handleCreate = (e, cluster) => {
    e.stopPropagation()
    setSelectedCluster(cluster)
    setOpenCreateClusterDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenCreateClusterDialog(false)
  }

  const renderChildren = (children, open, deep) => {
    if(children != null) {
      return (
        <Collapse in={open} timeout='auto' unmountOnExit>
          {children.map(child => (
              <List component='div' disablePadding>
                <ListItem disablePadding>
                  <ListItemButton sx={{ pl: deep}} onClick={() => handleClick(child)}>
                    <ListItemIcon>
                      <Numeric0BoxOutline />
                    </ListItemIcon>
                    <ListItemText primary={child.name} />
                    <Box sx={{display:'flex', justifyContent:'space-between', width:'6vW'}}>
                      <Tooltip title='Rename Cluster' placement='top'>
                        <PencilOutline onClick={e => handleRename(e, child)}/>
                      </Tooltip>
                      <Tooltip title='Create Clusters' placement='top'>
                        <Plus  onClick={e => handleCreate(e, child)}/>
                      </Tooltip>
                      {child.open ? <ChevronUp /> : <ChevronDown />}
                    </Box>
                  </ListItemButton>
                </ListItem>
                {child.children && renderChildren(child.children, child.open, deep + 4)}
              </List>
          ))}
           </Collapse>
      )
    }
    else {
      return <div></div>
    }
  }

  return (
    <Fragment>
      {clustersState.length && (
        <List component='nav' aria-label='main mailbox'>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleClick(clustersState[0])}>
              <ListItemIcon>
                <Numeric2BoxMultiple />
              </ListItemIcon>
              <ListItemText primary={clustersState[0].name + " (" +  getSubscriptionsCount(clustersState[0].id) + ')'} />
              <Box sx={{display:'flex', justifyContent:'space-between', width:'6vW'}}>
                <Tooltip title='Rename Cluster' placement='top'>
                  <PencilOutline onClick={e => handleRename(e, clustersState[0])}/>
                </Tooltip>
                <Tooltip title='Create Clusters' placement='top'>
                  <Plus  onClick={e => handleCreate(e, clustersState[0])}/>
                </Tooltip>
                {clustersState[0].open ? <ChevronUp /> : <ChevronDown />}
              </Box>
            </ListItemButton>
          </ListItem>
          {renderChildren(clustersState[0].children, clustersState[0].open, 6)}
        </List>
      )}
      <CreateClusterDialog 
        open={openCreateClusterDialog}
        onClose={handleCloseDialog}
        selectedCluster={selectedCluster}
        parent={clusters[0]}
      />
      {/* <Divider sx={{ m: 0 }} />
      <List component='nav' aria-label='secondary mailbox'>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ClockOutline />
            </ListItemIcon>
            <ListItemText primary='Snoozed' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AlertCircleOutline />
            </ListItemIcon>
            <ListItemText primary='Spam' />
          </ListItemButton>
        </ListItem>
      </List> */}
    </Fragment>
  )
}

export default ClustersList
