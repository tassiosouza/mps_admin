// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Import
import PencilOutline from 'mdi-material-ui/PencilOutline'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ContentSave from 'mdi-material-ui/ContentSave'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import Sidebar from 'src/@core/components/sidebar'
import ClustersTabs from './ClustersTabs'

// ** Store & Actions Imports
import { saveCluster, handleSavingClusters, handleCleanSelection, editCluster } from 'src/store/apps/clusters'

const ScrollWrapper = ({ children }) => {
  return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
}

const ClusterDetails = props => {

  const [clusterName, setClusterName] = useState('')

  // ** Props
  const {
    store,
    dispatch,
    open,
    handleClose,
  } = props

  const handleSaveCluster = () => {
    if(clusterName.length > 0) {
      dispatch(handleSavingClusters(true))
      dispatch(saveCluster({name: clusterName, callback: onSaveCallback}))
    }
    else {
      alert('Empty cluster name')
    }
  }

  const handleEditCluster = () => {
    setClusterName(store.selectedClusters[0].name)
    dispatch(editCluster(store.selectedClusters[0]))
  }

  const onSaveCallback = () => {
    closeDetails(false)
  }

  const handleChangeClusterName = e => {
    setClusterName(e.target.value)
  }

  const closeDetails = fromInterface => {
    if(fromInterface) {
      dispatch(handleCleanSelection([]))
    }
    setClusterName('')
    handleClose()
  }

  return (
    <Sidebar
      hideBackdrop
      direction='left'
      show={open}
      sx={{
        pt:34,
        zIndex: 1,
        width: '41.2vW',
        ['@media (min-width:1900px)']: { // eslint-disable-line no-useless-computed-key
          width: '43.4vW'
        }
      }}
    >
    {store.selectedClusters.length &&
      (<Fragment>
        <Box sx={{ height: '90%', backgroundColor: 'background.paper' }}>
          <ScrollWrapper>
            <Box sx={{ p:3, pl:5, pr:5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <IconButton onClick={() => closeDetails(true)} sx={{width:50, height:50}}>
                  <ChevronLeft/>
                </IconButton>
                  {store.selectedClusters[0].editing ? (
                    <TextField
                    autoFocus
                    onFocus={function(e) {
                      var val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;
                    }}
                    value={clusterName}
                    onChange={e => handleChangeClusterName(e)}
                    variant='standard'
                    size='small'
                    placeholder='Cluster Name'
                    sx={{ ml: 3, mb: 1, maxWidth: '180px', mt:2.5, fontSize:'20px'}}
                    InputProps={{ disableUnderline: true, style: {fontSize: 19} }}
                    />
                  ) : (
                    <Typography variant='h6' sx={{ ml:2, color: 'text.primary', alignSelf:'center' }}>{store.selectedClusters[0].name}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt:1 }}>
                  {store.selectedClusters[0].editing ? (
                     <Button sx={{height:'fit-content' }} onClick={() => handleSaveCluster()} color='primary' startIcon={<ContentSave/>}>
                      {store.saving ? 'Saving' : 'Save'}
                    </Button>
                  ) : (
                    <Button sx={{height:'fit-content' }} onClick={() => handleEditCluster()}color='primary' startIcon={<PencilOutline/>}>
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
            <Divider sx={{ m: 0 }} />
            {store.saving && <LinearProgress sx={{ height:'2px' }} />}
            <Box sx={{ pl: 5, pt:5 }}>
              <ClustersTabs store={store}></ClustersTabs>
            </Box>
          </ScrollWrapper>
        </Box>
      </Fragment>
      )}
    </Sidebar>
  )
}

export default ClusterDetails
