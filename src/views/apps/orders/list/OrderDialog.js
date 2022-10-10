// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'

// ** Third Party Styles Imports
import ReactLoading from 'react-loading'

import { Storage } from 'aws-amplify'

const OrderDialog = props => {
  const { open, onClose, order } = props

  const [imageURL, setImageURL] = useState('')
  const [loadingImage, setLoadingImage] = useState(false)

  useEffect(() => {
    async function fetchData(key) {
      const result = await Storage.get(key)
      setImageURL(result)
      setLoadingImage(false)
    }
    if (open) {
      setLoadingImage(true)
      fetchData(order.deliveryKey)
    }
  }, [open])

  const handleClose = async () => {
    setImageURL('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={reason => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
    >
      <DialogTitle id='alert-dialog-title'>Order {order?.id}</DialogTitle>
      <DialogContent>
        <DialogContent id='alert-dialog-description'>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {loadingImage == true ? (
                <ReactLoading type={'spokes'} width='20px' height='20px' color='#51AB3B' />
              ) : (
                <img src={imageURL} width='250px' height='330px' />
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={() => handleClose()}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderDialog
