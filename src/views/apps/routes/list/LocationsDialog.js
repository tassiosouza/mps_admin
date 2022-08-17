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

// ** Custom Components Imports
import LocationsTableHeader from 'src/views/apps/routes/list/LocationsTableHeader'
import LocationsTable from 'src/views/apps/routes/list/LocationsTable'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocations, addLocation, removeLocation, clearSelectedLocations, generateRoutes } from 'src/store/apps/routes'
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const Status = {
  INITIAL: 'initial',
  LOADING: 'loading',
  DONE: 'done'
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

  const handleConfirm = () => {
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

  const handleFinish = () => {

    onClose()
    setError('')
    setDriversValue('')
    setValue('')
  }

  const optimizationCallback = (error) => {
    setStatus(Status.DONE)
  }

  const handleClose = () => {
    dispatch(clearSelectedLocations())
    onClose()
    setError('')
    setDriversValue('')
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
      <Grid container spacing={3} direction='column'>
        <Grid item xs={6} sx={{alignSelf:'center'}}>
          <Player
          autoplay
          keepLastFrame
          src="https://assets8.lottiefiles.com/datafiles/Wv6eeBslW1APprw/data.json"
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
            {status != Status.DONE && <Button onClick={handleClose} sx={{ml: 3}}> Cancel</Button>}
            {status === Status.INITIAL && <Button onClick={handleConfirm}> Generate </Button>}
            {status === Status.DONE && <Button onClick={handleFinish}> Done </Button>}
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default LocationsDialog