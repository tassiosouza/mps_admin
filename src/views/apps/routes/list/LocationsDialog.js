// ** React Imports
import { Fragment, useState, useEffect, forwardRef, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import LinearProgress from '@mui/material/LinearProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Custom Components Imports
import LocationsTableHeader from 'src/views/apps/routes/list/LocationsTableHeader'
import LocationsTable from 'src/views/apps/routes/list/LocationsTable'

// ** Third Party Imports
import NumberPicker from "react-widgets/NumberPicker";

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { refreshLocations, addLocation, removeLocation, clearSelectedLocations } from 'src/store/apps/routes'

const LocationsDialog = (props) => {
  // ** Props
  console.log(JSON.stringify(props))
  const { open, onClose } = props

  // ** States
  const [value, setValue] = useState('')

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)

  useEffect(() => {
    console.log('enter in use effect')
    dispatch(
        refreshLocations({q: value})
      )
  }, [dispatch, value])

  // ** Functions
  const handleFilter = val => {
    setValue(val)
  }

  const handleClose = () => {
    dispatch(clearSelectedLocations())
    onClose()
  }

  const handleAddLocation = location => {
    dispatch(addLocation(location))
  }

  const handleRemoveLocation = location => {
    dispatch(removeLocation(location))
  }

  const getDeliveriesCount = () => {
    var result = 0
    store.selectedLocations.map(loc => result += loc.deliveries)
    return result
  }

  return (
      <Dialog
      open={open}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle id='scroll-dialog-title'>Generate Optimized Routes</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
        <Grid container spacing={3} sx={{mb:5, justifyContent:'space-between'}}>
        <Grid item xs={7}>
          <Typography variant='h7'>Select the numbers of drivers and the target locations you want to generate the optimized routes.</Typography>
        </Grid>
        <Grid item xs={5} sx={{textAlign:'right', pr:2}}>
          <OutlinedInput
            variant={'standard'}
            size='small'
            placeholder='Nº Drivers'
            sx={{  mb: 2, maxWidth: '180px'}}
            endAdornment={
              <InputAdornment position='end'>
                  <Typography variant='h7'>/ 15</Typography>
              </InputAdornment>
            }
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
      </DialogContent>
      <Grid container sx={{justifyContent:'space-between'}} direction='row'>
        <Grid item xs={5} sx={{alignSelf:'center', pl:5}}>
          <Typography variant='h7'>Total Deliveries: {getDeliveriesCount()}</Typography>
        </Grid>
        <Grid item xs={5}>
          <DialogActions >
            <Button onClick={handleClose}> Cancel</Button>
            <Button> Run</Button>
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default LocationsDialog