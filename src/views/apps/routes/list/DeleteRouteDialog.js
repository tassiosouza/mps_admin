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
import { deleteRoutes } from 'src/repository/apps/routes';

const DialogConfirmation = (props) => {

  const { open, onDelete, onCancel, routes, orders } = props

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const ordersToDelete = orders.filter(order => {
      for(var i = 0; i < routes.length; i++) {
        if(order.assignedRouteID === routes[i].id) {
          return true
        }
      }
      return false
    })
    setDeleting(true)
    const deletedRoute = await deleteRoutes(routes, ordersToDelete)
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
          This operation will delete the {routes.length > 1 ? 'routes' : 'route'} {routes.map((route, index) => <Box fontWeight='600' display='inline'> 
          {route.id}{index != routes.length -1 && ', '}</Box>)} and all the orders assigned to {routes.length > 1 ? 'them' : 'it'}.
           If the route has any assigned driver, it will be automatically unassigned. Are you sure you want to delete ? 
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
