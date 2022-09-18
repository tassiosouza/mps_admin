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
import { useDispatch, useSelector } from 'react-redux'
import { createClusters } from 'src/store/apps/clusters'

const CreateClusterDialog = (props) => {

  const { open, onClose, selectedCluster, parent } = props

  // ** Hooks
  const dispatch = useDispatch()

  const handleCreate = () => {

    // ** Check if it is the root call
    if(selectedCluster == parent) {
      console.log('igual parent')
      var children = {
        children: [
          {
            id: "id1",
            name: "Children 1",
            parent: parent.id,
            color: "#000000",
            open: false,
            children: null
          },
          { 
            id: "id2",
            name: "Children 2",
            parent: parent.id,
            color: "#000999",
            open: false,
            children: null
          }
        ]
      }
      const parsedChildren = JSON.stringify(children)
      var parentCopy = { ...parent, children:parsedChildren}
      dispatch(createClusters({rootCluster: parentCopy}))
    }
    else {
        // ** Find selected child in parent
        mountChild(parent, selectedCluster.id)
    }

    onClose()
  }

  const mountChild = (parent, id) => {
    if(parent.children) {
      var updatedChildren = parent.children.children.map(child => {
        if(child.id === id) {
          console.log('creating in: ' + JSON.stringify(child))
          var newChildren = {
            children: [
              {
                id: "id3",
                name: "Children 3",
                parent: parent.id,
                color: "#000000",
                open: false,
                children: null
              },
              { 
                id: "id4",
                name: "Children 4",
                parent: parent.id,
                color: "#000999",
                open: false,
                children: null
              }
            ]
          }
          return {...child, children:newChildren}
        }
        else {
          return child
        }
      })
    }
    console.log(JSON.stringify(updatedChildren))
    var parentCopy = {...parent, children:updatedChildren}
    dispatch(createClusters({rootCluster: parentCopy}))
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
            sx={{top: 15, right: 10, position: 'absolute', color:theme => theme.palette.grey[500]}}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          TEXT
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button onClick={handleCreate}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CreateClusterDialog
