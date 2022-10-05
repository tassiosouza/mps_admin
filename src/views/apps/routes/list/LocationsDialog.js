// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { DialogTitle, Dialog, DialogContent, DialogActions, TextField } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters, clearTempResults, generateRoutes, saveRoutes } from 'src/store/apps/routes'
import { Player } from '@lottiefiles/react-lottie-player';

// ** Icons Imports
import MapMarkerRadius from 'mdi-material-ui/MapMarkerRadius'
import ClockTimeEightOutline from 'mdi-material-ui/ClockTimeEightOutline'
import BriefcaseRemove from 'mdi-material-ui/BriefcaseRemove'
import AccountCancel from 'mdi-material-ui/AccountCancel'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import LocationsTableHeader from './LocationsTableHeader'

const Status = {
  INITIAL: 'initial',
  LOADING: 'loading',
  DONE: 'done',
  SAVING: 'saving'
}

const ALGORITHM_TYPE = {
  OPTIMIZATION: 'Optimization',
  CLUSTERING: 'Clustering'
}

const LocationsDialog = (props) => {
  // ** Props
  const { open, onClose } = props

  // ** States
  const [value, setValue] = useState('')
  const [driversValue, setDriversValue] = useState('')
  const [maxTimeValue, setMaxTimeValue] = useState('')
  const [status, setStatus] = useState(Status.INITIAL)
  const [error, setError] = useState('')
  const [selectedClusters, setSelectedClusters] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHM_TYPE.OPTIMIZATION)

  // ** Param States
  const [paramIsBalanced, setParamIsBalanced] = useState(true)
  const [paramIsFixed, setParamIsFixed] = useState(true)
  const [paramMaxTime, setParamMaxTime] = useState(200)
  const [paramClusterQty, setParamClusterQty] = useState(4)
  const [paramMinBags, setParamMinBags] = useState(4)
  const [paramMaxBags, setParamMaxBags] = useState(22)
  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)
  
  useEffect(() => {
    dispatch(fetchClusters({q: value}))
  }, [dispatch, value])

  // ** Functions
  const handleFilter = val => {
    setValue(val)
  }

  const handleGenerate = () => {
    // ** Form Validation
    // if(driversValue === '' || parseInt(driversValue) == 0 || parseInt(driversValue) > /*store.drivers.length*/ 50)
    // {
    //   setError('Invalid number of drivers')
    //   return
    // } 
    // if(!store.selectedLocations.length)
    // {
    //   setError('Select at least one location')
    //   return
    // } 
    // if(maxTimeValue === '' || parseInt(maxTimeValue) == 0)
    // {
    //   setError('The maximum time should be greater than 0')
    //   return
    // } 

    console.log('gerating with params: ')
    console.log('Algorith: ' + selectedAlgorithm)
    if(selectedAlgorithm == ALGORITHM_TYPE.OPTIMIZATION) {
      console.log('Max Time: ' + paramMaxTime)
    }else {
      console.log('Clusters Qty: ' + paramClusterQty)
    }
    console.log('Max Bags: ' + paramMaxBags)
    console.log('Min Bags: ' + paramMinBags)
    console.log('Selected clusters: ' + JSON.stringify(selectedClusters))
    console.log('State clusters: ' + JSON.stringify(store.clusters))
    console.log('Selected clusters: ' + JSON.stringify(selectedClusters))
    setError('')
    setStatus(Status.LOADING)
    dispatch(generateRoutes({
      parameters: {
        selectedAlgorithm,
        paramMaxTime,
        paramClusterQty,
        paramMinBags,
        paramMinBags,
        driversCount: store.drivers.length, 
      }, 
      subscriptions: store.subscriptions,
      clusters:selectedClusters,
      callback: optimizationCallback
    }))
  }

  const handleConfirm = () => {
    dispatch(saveRoutes({callback: handleClose}))
    setStatus(Status.SAVING)
  }

  const handleRetry = () => {
    setError('')
    setValue('')
    dispatch(clearTempResults())
    setStatus(Status.INITIAL)
  }

  const optimizationCallback = () => {
    setStatus(Status.DONE)
  }

  const handleClose = () => {
    onClose()
    setError('')
    setDriversValue('')
    setMaxTimeValue('')
    setValue('')
    setStatus(Status.INITIAL)
  }

  const getDeliveriesCount = () => {
    var result = 0
    store.clusters.map(cl => result += cl.subscriptionsCount)
    return result
  }

  var resolutionAnimationPath = ''
  var backgroundImage = ''
  var textColor = ''
  if(store.solution) {
    switch(store.solution.result) {
      case 'success':
        backgroundImage = 'url(/images/dialogs/result-ok-bg.png)'
        resolutionAnimationPath = "https://assets8.lottiefiles.com/datafiles/Wv6eeBslW1APprw/data.json"
        textColor = '#51AB3B'
      break
      case 'problem':
        backgroundImage = 'url(/images/dialogs/result-pro-bg.png)'
        resolutionAnimationPath = "https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json"
        textColor = '#FF9800'
      break
      case 'error':
        backgroundImage = 'url(/images/dialogs/result-err-bg.png)'
        resolutionAnimationPath = "https://assets2.lottiefiles.com/packages/lf20_qw8ewk7k.json"
        textColor = '#F21313'
      break
      default:
        backgroundImage = 'url(/images/dialogs/result-pro-bg.png)'
        resolutionAnimationPath = "https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json"
        textColor = '#FF9800'
      break
    }
  }

  const LoadingAndDone = () => {

    return status == Status.LOADING ? (
      <Grid container spacing={3} direction='column'>
        <Grid item xs={3}>
          <Typography component='div'>Generating optimized routes for 
            <Box fontWeight='600' display='inline'> {getDeliveriesCount()} Deliveries </Box>
            and 
            <Box fontWeight='600' display='inline'> {driversValue} Drivers</Box> 
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{mb: 8}}>
          <Typography component='div'>Expected wait time: 
            <Box fontWeight='600' display='inline'> 1min </Box>
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{alignSelf:'center'}}>
          <img src='/animations/optimizing.gif' width={300} height={300} />
        </Grid>
      </Grid>
    ) : (
      <Grid container spacing={10} direction='column'>
        <Grid item sx={{alignSelf:'center', display:'flex'}}>
          <Player
          autoplay
          keepLastFrame
          src={resolutionAnimationPath}
          style={{ height: '120px', width: '120px' }}
          >
          </Player>
        </Grid>
        <Grid item sx={{alignSelf:'center'}}>
          {store.solution.result === 'success' && <Typography sx={{fontSize:'25px', fontWeight:'600'}}>Optimization finished with success</Typography>}
          {store.solution.result === 'problem' && <Typography sx={{fontSize:'25px', fontWeight:'600'}}>Optimization finished with some problems</Typography>}
          {store.solution.result === 'error' && <Typography sx={{fontSize:'25px', fontWeight:'600'}}>Errors occurred during route optimization</Typography>}
        </Grid>
        <Grid item sx={{alignSelf:'center', display:'flex', pr:'40px', pl:'90px !important', justifyContent:'space-between', alignSelf:'auto'}}>
          <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <MapMarkerRadius sx={{alignSelf:'center'}}></MapMarkerRadius>
            {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center'}}>Routes</Typography>}
            {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center', color:textColor}}>{store.tempRoutes.length}</Typography>}
          </Box>
          <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <ClockTimeEightOutline sx={{alignSelf:'center'}}></ClockTimeEightOutline>
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center'}}>Max Duration</Typography>}
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center', color:textColor}}>{parseInt(store.solution.maxDuration/60)} min</Typography>}
          </Box>
          <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <AccountCancel sx={{alignSelf:'center'}}></AccountCancel>
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center'}}>Drivers Not Assigned</Typography>}
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center', color:textColor}}>{store.solution.driversNotAssigned}</Typography>}
          </Box>
          <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <BriefcaseRemove sx={{alignSelf:'center'}}></BriefcaseRemove>
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center'}}>Orders Left</Typography>}
          {store.solution.result != 'error' && <Typography sx={{fontSize:'15px', textAlign:'center', color:textColor}}>{store.solution.ordersLeft.length}</Typography>}
          </Box>
          {/* {store.solution.details.map((detail, index) => {
            return ( <Typography key={index} component='div'>{detail}</Typography>)
            })
          } */}
        </Grid>
      </Grid>
    )
  }

  const defaultColumns = [
    {
      flex: 1,
      field: 'name',
      minWidth: 80,
      headerName: 'Name',
      renderCell: ({ row }) => 
      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        {row.name}
      </Box>
    },
    {
      flex: 1,
      minWidth: 100,
      field:'subscriptionsCount',
      headerName: 'Subscriptions',
      renderCell: ({ row }) => 
      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        {row.subscriptionsCount}
      </Box>
    }
  ]

  const getSelectedAlgorithmParameters = () => {
    if(selectedAlgorithm === ALGORITHM_TYPE.CLUSTERING) {
      return (
        <Grid item>
        <Typography sx={{fontWeight:'bold'}} variant='h7'> Parameters </Typography>
        <Tooltip title='Choose the amount of clusters you want to generate and the min and max subscriptions will have on each other'>
          <InformationOutline sx={{fontSize:14, ml:1}}/>
        </Tooltip>
        <Box sx={{display:'flex', justifyContent:'space-between', pt:5}}>
          <FormControlLabel control={<Switch defaultChecked 
                                             value={paramIsFixed} onChange={() => setParamIsFixed(!paramIsFixed)}/>}
                                             labelPlacement='bottom' label='Fixed' />
          <Divider orientation="vertical" variant="middle" flexItem />
          <TextField
            variant='standard'
            size='small'
            label='Quantity'
            value={paramClusterQty}
            onChange={e => setParamClusterQty(e.target.value)}
            placeholder='Quantity'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
          <TextField
            variant='standard'
            size='small'
            label='Min Bags'
            value={paramMinBags}
            onChange={e => setParamMinBags(e.target.value)}
            placeholder='Min Bags'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
          <TextField
            variant='standard'
            size='small'
            label='Max Bags'
            value={paramMaxBags}
            onChange={e => setParamMaxBags(e.target.value)}
            placeholder='Max Bags'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
        </Box>
      </Grid>
      )
    } else {
      return (
        <Grid item>
        <Typography sx={{fontWeight:'bold'}} variant='h7'> Parameters </Typography>
        <Tooltip title='Here explanation about optimization'>
          <InformationOutline sx={{fontSize:14, ml:1}}/>
        </Tooltip>
        <Box sx={{display:'flex', justifyContent:'space-between', pt:5}}>
          <FormControlLabel control={<Switch defaultChecked 
                            value={paramIsBalanced} onChange={() => setParamIsBalanced(!paramIsBalanced)}/>} 
                            labelPlacement='bottom' label='Balanced' />
          <Divider orientation="vertical" variant="middle" flexItem />
          <TextField
            variant='standard'
            size='small'
            label='Max Time'
            value={paramMaxTime}
            onChange={e => setParamMaxTime(e.target.value)}
            placeholder='Max Time'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
          <TextField
            variant='standard'
            size='small'
            label='Min Bags'
            value={paramMinBags}
            onChange={e => setParamMinBags(e.target.value)}
            placeholder='Min Bags'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
          <TextField
            variant='standard'
            size='small'
            label='Max Bags'
            value={paramMaxBags}
            onChange={e => setParamMaxBags(e.target.value)}
            placeholder='Max Bags'
            sx={{width:'25%', fontSize:'20px', alignSelf:'center'}}
          />
        </Box>
      </Grid>
      )
    }
  }

  return (
      <Dialog
      open={open}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      PaperProps={{
        style: {
          width: '50%',
          maxWidth: 'none',
        },
      }}
    > 
      {(status == Status.LOADING || status == Status.SAVING) && <LinearProgress sx={{ height:'2px', mt:0.2 }} />}
      <DialogTitle id='scroll-dialog-title'>Generate Routes</DialogTitle>
      <DialogContent dividers={scroll === 'paper'} 
        style={{backgroundImage: status == Status.DONE || status == Status.SAVING ? backgroundImage : 'none',
          backgroundSize: status == Status.DONE || status == Status.SAVING ? 'cover' : 'none',
          width:'100%',
          height: status == Status.DONE || status == Status.SAVING ? '63vH' : '100%',
          display: 'flex',
          flexDirection:'column',
          justifyContent:'space-between'
        }}>
        {status === Status.INITIAL ? 
          (
          <div>
            <Grid container direction={'column'} spacing={3} sx={{alignContent:'start'}}>
              <Grid item>
                <Typography variant='h7'>Select the route generation algorithm: </Typography>
                <Select size='small' sx={{ml:2}} defaultValue={ALGORITHM_TYPE.OPTIMIZATION} value={selectedAlgorithm} 
                        onChange={e => setSelectedAlgorithm(e.target.value)}>
                  <MenuItem value='Optimization'>Optimization</MenuItem>
                  <MenuItem value='Clustering'>Clustering</MenuItem>
                </Select>
              </Grid>
                {getSelectedAlgorithmParameters()}
              <Grid item sx={{width:'100%'}}>
                <LocationsTableHeader handleFilter={handleFilter} selectedClusters={selectedClusters}></LocationsTableHeader>
                <Box sx={{height:'210px', ['@media (min-width:1900px)']: { // eslint-disable-line no-useless-computed-key
                    height: '475px'
                  }}}>
                    <DataGrid
                      hideFooter
                      selectionModel={selectedClusters.map(route => route.id)}
                      onSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids)
                        const selectedRowData = store.clusters.filter((cl) =>
                          selectedIDs.has(cl.id.toString())
                        )
                        setSelectedClusters(selectedRowData)
                      }}
                      pagination
                      checkboxSelection
                      disableSelectionOnClick
                      rows={store.clusters}
                      columns={defaultColumns}
                      sx={{'& .MuiDataGrid-columnHeaders': { borderRadius: 0 }}}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
          ) : (
            <LoadingAndDone/>
          )
        } 
        <Grid sx={{justifyContent:'end'}} direction='row' spacing={0}>
          <DialogActions sx={{pb:0}}>
            <Typography sx={{color:'error.main'}} variant='h7'>{error}</Typography>
            {status != Status.SAVING && <Button onClick={handleClose} sx={{ml: 3, color:status == Status.DONE ?'#fff' : 'primary'}}> Cancel</Button>}
            {status === Status.DONE && <Button onClick={handleRetry} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Retry </Button>}
            {status === Status.INITIAL && <Button onClick={handleGenerate} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Generate </Button>}
            {status === Status.DONE && store.solution.result != 'error' && <Button onClick={handleConfirm} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Confirm </Button>}
            {status === Status.SAVING && <Button disabled onClick={handleConfirm} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Saving... </Button>}
          </DialogActions>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default LocationsDialog