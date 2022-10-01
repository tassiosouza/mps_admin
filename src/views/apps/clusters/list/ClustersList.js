// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import Plus from 'mdi-material-ui/Plus'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DownloadOutline from 'mdi-material-ui/DownloadOutline'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import uuid from 'react-uuid';

// ** MUI Imports 
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { handleSelectAllClusters, handleSelectCluster, handleAddCluster, handleOpenCluster } from 'src/store/apps/clusters'

// ** Clusters App Component Imports
import ClusterDetails from './ClusterDetails'

const ClustersList = props => {

  const { store } = props
  const [clusterDetailOpen, setClusterDetailsOpen] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()

  const ScrollWrapper = ({ children }) => {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }

  const ClusterItem = styled(ListItem)(({ theme }) => ({
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

  const handleCreateCluster = () => {
    const newCluster = {
      id: uuid(),
      name: 'Cluster Name',
      editing: true,
      path: store.currentPath,
      color: "#" + ((1<<24)*Math.random() | 0).toString(16),
      new:true
    }
    dispatch(handleAddCluster(newCluster))
    setClusterDetailsOpen(true)
  }

  const selectCluster = (cluster) => {
    dispatch(handleOpenCluster(cluster))
    setClusterDetailsOpen(true)
  }

  const handleCloseClusterDetails = () => {
    setClusterDetailsOpen(false)
  }

  return (
    <Card>
      <CardHeader sx={{pl:7}}title='Clusters'/>
      {store.loading && <LinearProgress sx={{ height:'2px' }} />}
      <CardContent sx={{p:0}}>
      <Box sx={{px: { xs: 2.5, sm: 5}, backgroundColor:'background.paper' }}>
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
              <Button sx={{height:'fit-content'}} color='primary' startIcon={<Plus/>} onClick={() => handleCreateCluster()}>
                Add
              </Button>
              </Box>
            </Box>
          </Box>
      <Divider sx={{ mb: 0, mt:5 }} />
      <Box sx={{ p: 0,
            maxHeight: '56vh',
            display: 'flex',
            overflowY: 'auto',
            flexGrow: 1,
            flexDirection: 'column',
            ['@media (min-width:1900px)']: { // eslint-disable-line no-useless-computed-key
              maxHeight: '61.5vH'
            } }}>
          <ScrollWrapper>
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
                      }}>
                      <ClusterItem
                        onClick={() => {
                          selectCluster(cluster)
                        }}
                        sx={{ py: 2.75, p:3, backgroundColor: 'background.paper' }}
                      >
                        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                          <Checkbox
                            onClick={e => e.stopPropagation()}
                            onChange={() => dispatch(handleSelectCluster(cluster))}
                            checked={store.selectedClusters.includes(cluster) || false}/>
                          <Box sx={{
                              display: 'flex',
                              overflow: 'hidden',
                              flexDirection: { xs: 'column', sm: 'column' },
                              alignItems: { xs: 'flex-start', sm: 'flex-start' }
                            }} >
                            <Typography sx={{
                                mr: 4,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }} >
                              {cluster.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          className='mail-actions'
                          sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Tooltip placement='top' title='Edit'>
                            <IconButton>
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                          <Tooltip placement='top' title='Delete'>
                            <IconButton>
                              <DownloadOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          className='mail-info-right'
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction:'column' }}>
                          <Box sx={{ display: { xs: 'flex', sm: 'flex', flexDirection:'column', alignItems:'center' } }}>
                            {cluster.subscriptionsCount}
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
                      </ClusterItem>
                      {store.clusters !== null && store.clusters.length - 1 > index ? (
                        <Divider sx={{ my: 0, mx: -5 }} />
                      ) : null}
                    </Box>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AlertCircleOutline fontSize='small' sx={{ mr: 2 }} />
                <Typography>No Clusters Found</Typography>
              </Box>
            )}
          </ScrollWrapper>
        </Box>
      </CardContent>
      <ClusterDetails
        store={store}
        dispatch={dispatch}
        open={clusterDetailOpen}
        handleClose={handleCloseClusterDetails} />
    </Card>
  )
}

export default ClustersList
