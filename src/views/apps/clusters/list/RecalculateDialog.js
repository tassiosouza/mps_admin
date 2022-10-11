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
import { recalculateClusters } from 'src/store/apps/clusters'

const RecalculateDialog = props => {
  const { open, onRecalculate, onCancel, clusters, dispatch } = props

  const [recalculating, setRecalculate] = useState(false)

  const handleRecalculate = async () => {
    setRecalculate(true)
    dispatch(recalculateClusters({ clustersToRecalculate: clusters, callback: recalculateCallback }))
  }

  const recalculateCallback = () => {
    setRecalculate(false)
    onRecalculate()
  }

  return (
    <Dialog open={open} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
      {recalculating && <LinearProgress sx={{ height: '2px', mt: 0.2 }} />}
      <DialogTitle id='alert-dialog-title'>Recalculate Cluster</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          This operation will recalculate the {clusters.length > 1 ? 'clusters' : 'cluster'}{' '}
          {clusters.map((cl, index) => (
            <Box fontWeight='600' display='inline'>
              {cl.name}
              {index != clusters.length - 1 && ', '}
            </Box>
          ))}
          . All the subscriptions inside to {clusters.length > 1 ? 'them' : 'it'} will be automatically self assigned.
          Are you sure you want to proceed ?
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button color='error' onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={recalculating} onClick={handleRecalculate}>
          {recalculating ? 'Recalculating' : 'Recalculate'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RecalculateDialog
