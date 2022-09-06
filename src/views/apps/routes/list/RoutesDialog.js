// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Script Hook Import
import useScript from 'src/hooks/useScript'

// ** React Imports
import { useState, useEffect } from 'react'

const DialogFullScreen = (props) => {

  const { open, onClose, route, orders } = props
  
  const [mapRoute, setMapRoute] = useState(null)
  const [mapOrders, setMapOrders] = useState(null)
  const [driverID, setDriverID] = useState(null)

  useEffect(() => {

    if(route != null) {

      console.log('entering in use effect')
    }

  }, [route])

  const getRandomFloat = (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
    return parseFloat(str);
  }

  const MapKit = props => {
    useScript('/scripts/mapkit.js')
  }

  const ordersToDisplay = []
  const routeToDisplay = null
  const routeID = 'No route to display'

  if(route != null) {
    routeToDisplay = route
    routeID = route.id
    ordersToDisplay = orders.filter(order => {
      return order.assignedRouteID === route.id
    })
  }

  const divStyle = {
    width: '100%',
    height: '100%',
    position:"relative"
  };

  return (
    <div>
      <Dialog fullScreen onClose aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            {routeID} - Unassigned
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{top: 15, right: 10, position: 'absolute', color:theme => theme.palette.grey[500]}}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div 
          id="map"
          style={divStyle}
          route={routeToDisplay ? JSON.stringify(routeToDisplay) : ''}
          orders={ordersToDisplay ? JSON.stringify(ordersToDisplay) : ''}>
            <MapKit/>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogFullScreen
