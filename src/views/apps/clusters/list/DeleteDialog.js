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
import { deleteClusters } from 'src/store/apps/clusters';

const DeleteDialog = (props) => {

  const { open, onDelete, onCancel, clusters, dispatch } = props

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    dispatch(deleteClusters({clustersToDelete: clusters, callback: deleteCallback}))
  } 

  const deleteCallback = () => {
    setDeleting(false)
    onDelete()
  }

  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      {deleting && <LinearProgress sx={{ height:'2px', mt:0.2 }} />}
      <DialogTitle id='alert-dialog-title'>Delete Cluster</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          This operation will delete the {clusters.length > 1 ? 'clusters' : 'cluster'} {clusters.map((cl, index) => <Box fontWeight='600' display='inline'> 
          {cl.name}{index != clusters.length -1 && ', '}</Box>)}.
           All the subscriptions assigned to {clusters.length > 1 ? 'them' : 'it'} will be automatically detacheds. Are you sure you want to delete ? 
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color='error' disabled={deleting} onClick={handleDelete}>{deleting ? 'Deleting' : 'Delete'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
