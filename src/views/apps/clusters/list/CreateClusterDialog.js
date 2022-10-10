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

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { createClusters } from 'src/store/apps/clusters'

const CreateClusterDialog = props => {
  const { open, onClose, selectedCluster, parent } = props

  // ** Hooks
  const dispatch = useDispatch()

  const handleCreate = () => {
    dispatch(createClusters({ parentCluster: selectedCluster }))
    onClose()
  }

  return (
    <div>
      <Dialog onClose aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            Create Clusters
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{ top: 15, right: 10, position: 'absolute', color: theme => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>TEXT</DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button onClick={handleCreate}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CreateClusterDialog
