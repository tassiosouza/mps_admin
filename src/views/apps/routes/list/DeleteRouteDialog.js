// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

// ** Repository Imports
import { deleteRoute } from 'src/repository/apps/routes';

const DialogConfirmation = (props) => {

  const { open, onDelete, onCancel, route, orders } = props

  const [deleting, setDeleting] = useState(false)

  const routeID = route ? route.id : ''

  const handleDelete = async () => {
    setDeleting(true)
    const deletedRoute = await deleteRoute(route, orders)
    setDeleting(false)
    onDelete(deletedRoute)
  }

  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
    >
      {deleting && <LinearProgress sx={{ height:'2px', mt:0.2 }} />}
      <DialogTitle id='alert-dialog-title'>Delete Route</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          This operation will delete the route <Box fontWeight='600' display='inline'> {routeID} </Box> and all the orders assigned to it. If the route has any assigned driver,
          it will be automatically unassigned. Are you sure you want to delete ? 
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color='error' disabled={deleting} onClick={handleDelete}>{deleting ? 'Deleting' : 'Delete'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogConfirmation
