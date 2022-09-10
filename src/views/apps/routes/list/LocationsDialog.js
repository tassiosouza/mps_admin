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
import { styled } from "@mui/material/styles";

// ** Custom Components Imports
import LocationsTableHeader from 'src/views/apps/routes/list/LocationsTableHeader'
import LocationsTable from 'src/views/apps/routes/list/LocationsTable'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocations, addLocation, removeLocation, clearTempResults, clearSelectedLocations, generateRoutes, saveRoutes } from 'src/store/apps/routes'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { AssignStatus } from 'src/models'

// ** Icons Imports
import MapMarkerRadius from 'mdi-material-ui/MapMarkerRadius'
import ClockTimeEightOutline from 'mdi-material-ui/ClockTimeEightOutline'
import BriefcaseRemove from 'mdi-material-ui/BriefcaseRemove'
import AccountCancel from 'mdi-material-ui/AccountCancel'
import Alert from 'mdi-material-ui/Alert'

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
  const [maxTimeValue, setMaxTimeValue] = useState('')
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
    if(driversValue === '' || parseInt(driversValue) == 0 || parseInt(driversValue) > /*store.drivers.length*/ 50)
    {
      setError('Invalid number of drivers')
      return
    } 
    if(!store.selectedLocations.length)
    {
      setError('Select at least one location')
      return
    } 
    if(maxTimeValue === '' || parseInt(maxTimeValue) == 0)
    {
      setError('The maximum time should be greater than 0')
      return
    } 

    setError('')
    setStatus(Status.LOADING)
    dispatch(generateRoutes({driversCount: parseInt(driversValue), maxTime:parseInt(maxTimeValue), callback: optimizationCallback}))
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

  const handleMaxTimeChange = (e) => {
    const re = /^[0-9\b]+$/;

    // ** if value is not blank, then test the regex
    if (e.target.value === '' || re.test(e.target.value)) {
       setMaxTimeValue(e.target.value)
    }
  }

  const getDeliveriesCount = () => {
    var result = 0
    store.selectedLocations.map(loc => result += loc.deliveries)
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
      <DialogTitle id='scroll-dialog-title'>Generate Optimized Routes</DialogTitle>
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
          <div >
            <Grid container spacing={3} sx={{mb:5, justifyContent:'space-between'}}>
              <Grid item xs={6}>
                <Typography variant='h7'>Select the numbers of drivers, the target locations and the maximum 'in route' time(min).</Typography>
              </Grid>
              <Grid item xs={3} sx={{textAlign:'right', pr:2}}>
                <OutlinedInput
                  variant={'standard'}
                  size='small'
                  value={driversValue}
                  placeholder='Nº Drivers'
                  sx={{  mb: 2, maxWidth: '180px'}}
                  endAdornment={
                    <InputAdornment position='end'>
                        <Typography variant='h7'>/ {store.drivers.filter(driver => driver.assignStatus === AssignStatus.UNASSIGNED).length}</Typography>
                    </InputAdornment>
                  }
                  onChange={handleDriversCountChange}
                />
              </Grid>
              <Grid item xs={3} sx={{textAlign:'right', pr:2}}>
                <OutlinedInput
                  variant={'standard'}
                  size='small'
                  value={maxTimeValue}
                  placeholder='Max'
                  sx={{  mb: 2, maxWidth: '180px'}}
                  endAdornment={
                    <InputAdornment position='end'>
                        <Typography variant='h7'>minutes</Typography>
                    </InputAdornment>
                  }
                  onChange={handleMaxTimeChange}
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
        <Grid container sx={{justifyContent:'space-between'}} direction='row' spacing={0}>
        <Grid item xs={5} sx={{alignSelf:'center', pl:5}}>
          {status === Status.INITIAL && <Typography variant='h7'>Total Deliveries: {getDeliveriesCount()}</Typography>}
        </Grid>
        <Grid item xs={7}>
          <DialogActions sx={{pb:status == Status.DONE ? '0px' : ''}}>
            <Typography sx={{color:'error.main'}} variant='h7'>{error}</Typography>
            {status != Status.SAVING && <Button onClick={handleClose} sx={{ml: 3, color:status == Status.DONE ?'#fff' : 'primary'}}> Cancel</Button>}
            {status === Status.DONE && <Button onClick={handleRetry} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Retry </Button>}
            {status === Status.INITIAL && <Button onClick={handleGenerate} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Generate </Button>}
            {status === Status.DONE && store.solution.result != 'error' && <Button onClick={handleConfirm} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Confirm </Button>}
            {status === Status.SAVING && <Button disabled onClick={handleConfirm} sx={{color:status == Status.DONE ?'#fff' : 'primary'}}> Saving... </Button>}
          </DialogActions>
        </Grid>
      </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default LocationsDialog