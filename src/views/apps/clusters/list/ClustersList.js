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
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

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

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports 
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Backdrop from '@mui/material/Backdrop'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// ** Icons Import
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import Circle from 'mdi-material-ui/Circle'
import Reload from 'mdi-material-ui/Reload'
import Magnify from 'mdi-material-ui/Magnify'
import StarOutline from 'mdi-material-ui/StarOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LabelOutline from 'mdi-material-ui/LabelOutline'
import FolderOutline from 'mdi-material-ui/FolderOutline'
import EmailOpenOutline from 'mdi-material-ui/EmailOpenOutline'
import AlertOctagonOutline from 'mdi-material-ui/AlertOctagonOutline'


// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { handleSetOpenCluster } from 'src/store/apps/clusters'
import { createClusters, handleLoadingClusters, handleSelectAllClusters, handleSelectCluster } from 'src/store/apps/clusters'

import { arrayToTree } from "performant-array-to-tree";

const ClusterActions = (props) => {

  const {cluster} = props

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
      {true && <CircleMedium sx={{color:cluster.color}}/>}
      <Box sx={{contentVisibility: true ? 'visible' : 'hidden', alignSelf:'end'}}>{cluster.open ? <ChevronUp /> : <ChevronDown />}</Box>
      <div>
        <IconButton size='small' component='a' sx={{ textDecoration: 'none' }} onClick={handleClick}>
          <DotsVertical/>
        </IconButton>
        <Menu keepMounted id='simple-menu' anchorEl={anchorEl} onClose={handleCloseMenu} open={Boolean(anchorEl)}>
            <MenuItem onClick={e => handleClusterSplit(e)} disabled={false}>
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

  const { store } = props

  // ** State
  const [openCreateClusterDialog, setOpenCreateClusterDialog] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [clustersState, setClustersState] = useState([])
  
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

  const ScrollWrapper = ({ children, hidden }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
    }
  }

  const MailItem = styled(ListItem)(({ theme }) => ({
    zIndex: 1,
    cursor: 'pointer',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('xs')]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5)
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5)
    }
  }))
  

  const ClusterNestedList = (clusters, open, deep) => {
    if(clusters != null) {
      return (
        <Collapse in={open} timeout='auto' unmountOnExit>
          {clusters.map(cluster => (
              <List component='div' disablePadding>
                <ListItem disablePadding>
                  <Card>
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
                  </Card>
                </ListItem>
                {cluster.children && ClusterNestedList(cluster.children, cluster.open, deep + 4)}
              </List>
          ))}
        </Collapse>
      )
    }
  }

  return (
    <Card>
      <CardHeader sx={{pl:7}}title='Clusters' />
      <CardContent sx={{pl:0, pr:0}}>
      <Box sx={{px: { xs: 2.5, sm: 5 }, backgroundColor:'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {store && store.clusters && store.clusters ? (
                <Checkbox
                onChange={e => dispatch(handleSelectAllClusters(e.target.checked))}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: '1.375rem', ml:0.1 },
                  '&:not(.Mui-checked) .MuiSvgIcon-root': { color: 'text.disabled' }
                }}
                checked={(store.clusters.length && store.clusters.length === store.selectedClusters.length) || false}
                indeterminate={
                  !!(
                    store.clusters.length &&
                    store.selectedClusters.length &&
                    store.clusters.length !== store.selectedClusters.length
                  )
                }
                />
              ) : null}

              {store && store.clusters.length && store.selectedClusters && store.selectedClusters.length ? (
                <Fragment>
                  <IconButton >
                    <DeleteOutline />
                  </IconButton>
                  <IconButton>
                    <DownloadOutline/>
                  </IconButton>
                </Fragment>
              ) : null}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <TextField
                size='small'
                placeholder='Search Cluster'
                sx={{ mr: 3, maxWidth: '180px'}}
                onChange={() => {}}
              />
              <Button sx={{height:'fit-content' }} variant='contained' color='primary' startIcon={<Plus/>}>
                  Add
              </Button>
              </Box>
            </Box>
          </Box>
      <Divider sx={{ mb: 0, mt:5 }} />
      <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7rem)' }}>
          <ScrollWrapper hidden={false}>
            {store && store.clusters && store.clusters.length ? (
              <List sx={{ p: 0 }}>
                {store.clusters.map((cluster, index) => {
                  return (
                    <Box
                      key={cluster.id}
                      sx={{
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                          zIndex: 2,
                          boxShadow: '3',
                          transform: 'translateY(-2px)',
                          '& .mail-info-right': {
                            display: 'none'
                          },
                          '& .mail-actions': {
                            display: 'flex'
                          }
                        }
                      }}
                    >
                      <MailItem
                        sx={{ py: 2.75, p:4, backgroundColor: false ? 'action.hover' : 'background.paper' }}
                      >
                        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                          <Checkbox
                            onClick={e => e.stopPropagation()}
                            onChange={() => dispatch(handleSelectCluster(cluster.id))}
                            checked={store.selectedClusters.includes(cluster.id) || false}
                          />
                         
                          <Box
                            sx={{
                              display: 'flex',
                              overflow: 'hidden',
                              flexDirection: { xs: 'column', sm: 'column' },
                              alignItems: { xs: 'flex-start', sm: 'flex-start' }
                            }}
                          >
                            <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {cluster.name}
                            </Typography>
                            <Typography noWrap variant='body2' sx={{ width: '90%' }}>
                              {cluster.name} {cluster.name} {cluster.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          className='mail-actions'
                          sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                          

                          <Tooltip placement='top' title='Edit'>
                            <IconButton
                            >
                              <PencilOutline />
                            </IconButton>
                          </Tooltip>
                          <Tooltip placement='top' title='Delete'>
                            <IconButton
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          className='mail-info-right'
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction:'column' }}
                        >
                          <Box sx={{ display: { xs: 'flex', sm: 'flex', flexDirection:'column', alignItems:'center' } }}>{'397'}
                            <Typography
                              variant='caption'
                              sx={{
                                minWidth: '50px',
                                textAlign: 'right',
                                lineHeight: '.95rem',
                                whiteSpace: 'nowrap',
                                color: 'text.disabled'
                              }}
                            >
                              Subscriptions
                            </Typography>
                          </Box>
                        </Box>
                      </MailItem>
                      {store.clusters !== null && store.clusters.length - 1 > index ? (
                        <Divider sx={{ my: 0, mx: -5 }} />
                      ) : null}
                    </Box>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AlertCircleOutline fontSize='small' sx={{ mr: 2 }} />
                <Typography>No Mails Found</Typography>
              </Box>
            )}
          </ScrollWrapper>
        </Box>
      </CardContent>
      {/* <CreateClusterDialog 
        open={openCreateClusterDialog}
        onClose={handleCloseDialog}
        selectedCluster={selectedCluster}
        parent={store.clusters[0]}
      /> */}
    </Card>
  )
}

export default ClustersList
