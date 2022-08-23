// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import { DialogTitle, Dialog, DialogContent, DialogActions } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import LocationsTableHeader from 'src/views/apps/routes/list/LocationsTableHeader'
import LocationsTable from 'src/views/apps/routes/list/LocationsTable'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocations, addLocation, removeLocation, clearTempResults, clearSelectedLocations, generateRoutes, saveRoutes } from 'src/store/apps/routes'
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const Status = {
  INITIAL: 'initial',
  LOADING: 'loading',
  DONE: 'done',
  SAVING: 'saving'
}

const LocationsDialog = (props) => {
  // ** Props
  const { open, onClose } = props

  // ** States
  const [value, setValue] = useState('')
  const [driversValue, setDriversValue] = useState('')
  const [status, setStatus] = useState(Status.INITIAL)
  const [error, setError] = useState('')

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)
  
  useEffect(() => {
    dispatch(fetchLocations({q: value}))
  }, [dispatch, value])

  // ** Functions
  const handleFilter = val => {
    setValue(val)
  }

  const handleGenerate = () => {
    // ** Form Validation
    if(driversValue === '' || parseInt(driversValue) == 0 || parseInt(driversValue) > store.drivers.length)
    {
      setError('Invalid number of drivers')
      return
    } 
    if(!store.selectedLocations.length)
    {
      setError('Select at least one location')
      return
    } 

    setError('')
    setStatus(Status.LOADING)
    dispatch(generateRoutes({driversCount: parseInt(driversValue), callback: optimizationCallback}))
  }

  const handleConfirm = () => {
    dispatch(saveRoutes({callback: onClose}))
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
    setValue('')
    setStatus(Status.INITIAL)
  }

  const handleAddLocation = location => {
    dispatch(addLocation(location))
  }

  const handleRemoveLocation = location => {
    dispatch(removeLocation(location))
  }

  const handleDriversCountChange = (e) => {
    const re = /^[0-9\b]+$/;

    // ** if value is not blank, then test the regex
    if (e.target.value === '' || re.test(e.target.value)) {
       setDriversValue(e.target.value)
    }
  }

  const getDeliveriesCount = () => {
    var result = 0
    store.selectedLocations.map(loc => result += loc.deliveries)
    return result
  }

  const LoadingAndDone = () => {
    var resolutionAnimationPath = ''
    if(store.solution) {
      switch(store.solution.result) {
        case 'success':
          resolutionAnimationPath = "https://assets8.lottiefiles.com/datafiles/Wv6eeBslW1APprw/data.json"
        break
        case 'problem':
          resolutionAnimationPath = "https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json"
        break
        case 'error':
          resolutionAnimationPath = "https://assets2.lottiefiles.com/packages/lf20_qw8ewk7k.json"
        break
        default:
          resolutionAnimationPath = "https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json"
        break
      }
    }

    return status == Status.LOADING ? (
      <Grid container spacing={3} direction='column'>
        <Grid item xs={3}>
          <Typography component='div'>Generating optimized routes for 
            <Box fontWeight='600' display='inline'> {getDeliveriesCount()} Deliveries </Box>
            and 
            <Box fontWeight='600' display='inline'> {store.drivers.length} Drivers</Box> 
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
      <Grid container spacing={3} direction='row' sx={{width:'100vh'}}>
        <Grid item xs={6} sx={{alignSelf:'center'}}>
          {store.solution.result === 'success' && <Typography component='div'>Optimization finished with success</Typography>}
          {store.solution.result === 'problem' && <Typography component='div'>Optimization finished with some problems</Typography>}
          {store.solution.result === 'error' && <Typography component='div'>Errors occurred during route optimization</Typography>}

          {store.solution.result != 'error' && <Typography component='div'>Number of Routes: {store.tempRoutes.length}</Typography>}
          {store.solution.result != 'error' && <Typography component='div'>Max route duration: {store.solution.maxDuration}</Typography>}
          {store.solution.result != 'error' && <Typography component='div'>Total distance: {store.solution.totalDistance}</Typography>}
          {store.solution.result != 'error' && <Typography component='div'>Drivers not assigned: {}</Typography>}
          {store.solution.result != 'error' && <Typography component='div'>Orders left: {store.solution.ordersLeft.length}</Typography>}

          {store.solution.details.length > 0 && <Typography component='div'>Problems:</Typography>}
          {store.solution.details.map((detail, index) => {
            return ( <Typography key={index} component='div'>{detail}</Typography>)
            })
          }
        </Grid>
        <Grid item xs={6} sx={{alignSelf:'center'}}>
          <Player
          autoplay
          keepLastFrame
          src={resolutionAnimationPath}
          style={{ height: '200px', width: '200px' }}
        >
          </Player>
        </Grid>
      </Grid>
    )
  }

  return (
      <Dialog
      open={open}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    > 
      {(status == Status.LOADING || status == Status.SAVING) && <LinearProgress sx={{ height:'2px', mt:0.2 }} />}
      <DialogTitle id='scroll-dialog-title'>Generate Optimized Routes</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        {status === Status.INITIAL ? 
          (
          <div>
            <Grid container spacing={3} sx={{mb:5, justifyContent:'space-between'}}>
              <Grid item xs={7}>
                <Typography variant='h7'>Select the numbers of drivers and the target locations you want to generate the optimized routes.</Typography>
              </Grid>
              <Grid item xs={5} sx={{textAlign:'right', pr:2}}>
                <OutlinedInput
                  variant={'standard'}
                  size='small'
                  value={driversValue}
                  placeholder='Nº Drivers'
                  sx={{  mb: 2, maxWidth: '180px'}}
                  endAdornment={
                    <InputAdornment position='end'>
                        <Typography variant='h7'>/ {store.drivers.length}</Typography>
                    </InputAdornment>
                  }
                  onChange={handleDriversCountChange}
                />
              </Grid>
            </Grid>
            <LocationsTableHeader 
              value={value} 
              selectedLocations={store.selectedLocations} 
              handleFilter={handleFilter} />
            <LocationsTable 
              locations={store.locations}
              selectedLocations={store.selectedLocations} 
              addLocation={handleAddLocation} 
              removeLocation={handleRemoveLocation}/>
          </div>
          ) : (
            <LoadingAndDone/>
          )
        } 
      </DialogContent>
      <Grid container sx={{justifyContent:'space-between'}} direction='row' spacing={0}>
        <Grid item xs={5} sx={{alignSelf:'center', pl:5}}>
          {status === Status.INITIAL && <Typography variant='h7'>Total Deliveries: {getDeliveriesCount()}</Typography>}
        </Grid>
        <Grid item xs={7}>
          <DialogActions>
            <Typography sx={{color:'error.main'}} variant='h7'>{error}</Typography>
            {status != Status.SAVING && <Button onClick={handleClose} sx={{ml: 3}}> Cancel</Button>}
            {status === Status.DONE && <Button onClick={handleRetry}> Retry </Button>}
            {status === Status.INITIAL && <Button onClick={handleGenerate}> Generate </Button>}
            {status === Status.DONE && store.solution.result != 'error' && <Button onClick={handleConfirm}> Confirm </Button>}
            {status === Status.SAVING && <Button disabled onClick={handleConfirm}> Saving... </Button>}
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default LocationsDialog