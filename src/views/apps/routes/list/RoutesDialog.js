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

const DialogFullScreen = (props) => {

  const { open, onClose, route } = props

  if(route) {
    console.log('starting map script with: ' + JSON.stringify(route))
  }
  
  const MapKit = props => {
    useScript('/scripts/mapkit.js');
  }

  const divStyle = {
    width: '100%',
    height: '100%',
  };

  return (
    <div>
      <Dialog fullScreen onClose aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            Modal title
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
          data={route ? JSON.stringify(route) : ''}>
            <MapKit/>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button onClick={onClose}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogFullScreen
