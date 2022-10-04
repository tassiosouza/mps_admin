// ** React Imports
import { useState } from 'react'

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
import { deleteSubscriptions } from 'src/repository/apps/subscriptions'

const DeleteSubscriptionsDialog = (props) => {

  const { open, onDelete, onCancel, subscriptions } = props

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const deletedSubscriptionResult = await deleteSubscriptions(subscriptions)
    setDeleting(false)
    onDelete(deletedSubscriptionResult)
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
        {subscriptions.length && 
          <DialogContentText id='alert-dialog-description'>
          This operation will delete {subscriptions.length > 1 ? subscriptions.length + ' subscriptions' : ' the subscription ' + subscriptions[0].number}
          . Are you sure you want to delete ? 
          </DialogContentText>
        }
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color='error' disabled={deleting} onClick={handleDelete}>{deleting ? 'Deleting' : 'Delete'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteSubscriptionsDialog
