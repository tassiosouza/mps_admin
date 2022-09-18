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

const ClustersList = props => {

  const { clusters, subscriptions } = props

  // ** State
  const [open, setOpen] = useState(true)
  const [openCreateClusterDialog, setOpenCreateClusterDialog] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState(null)

  // ** Hooks
  const dispatch = useDispatch()

  // ** Functions
  const handleClick = (cluster) => {
    dispatch(handleSetOpenCluster(cluster))
  }

  const getSubscriptionsCount = clusterID => {
    return subscriptions.filter(sub => {
      var clusters = JSON.parse(sub.clusters)
      return clusters.clusters.includes(clusterID)
    }).length
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
    console.log('rend child in ' + deep +": " + JSON.stringify(children))
    if(children != null) {
      return (
        <Collapse in={open} timeout='auto' unmountOnExit>
          {children.children.map(child => (
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
                      {open ? <ChevronUp /> : <ChevronDown />}
                    </Box>
                  </ListItemButton>
                </ListItem>
                {child.children && renderChildren(child.children, open, deep + 4)}
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
      <List component='nav' aria-label='main mailbox'>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleClick(clusters[0])}>
            <ListItemIcon>
              <Numeric2BoxMultiple />
            </ListItemIcon>
            <ListItemText primary={clusters[0].name + " (" +  getSubscriptionsCount(clusters[0].id) + ')'} />
            <Box sx={{display:'flex', justifyContent:'space-between', width:'6vW'}}>
              <Tooltip title='Rename Cluster' placement='top'>
                <PencilOutline onClick={e => handleRename(e, clusters[0])}/>
              </Tooltip>
              <Tooltip title='Create Clusters' placement='top'>
                <Plus  onClick={e => handleCreate(e, clusters[0])}/>
              </Tooltip>
              {open ? <ChevronUp /> : <ChevronDown />}
            </Box>
          </ListItemButton>
        </ListItem>
        {renderChildren(clusters[0].children, clusters[0].open, 6)}
      </List>
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
