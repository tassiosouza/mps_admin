// ** Next Import
import Link from 'next/link'

// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { loadSubscriptionsFromFile, handleLoadingSubscriptions } from 'src/store/apps/subscriptions'

// ** Icons Import
import Reload from 'mdi-material-ui/Reload'

const TableHeader = props => {
  // ** Props
  const { value, selectedRows, handleFilter, handleMultipleAction } = props

  // ** Variables
  const allowedExtensions = ['csv']

  // ** States
  const [loadFileError, setLoadFileError] = useState('')
  const [open, setOpen] = useState(false)
  const [messageInfo, setMessageInfo] = useState('')
  const [syncError, setSyncError] = useState(false)
  const [actionValue, setActionValue] = useState('')

  // ** Refs
  const hiddenFileInput = useRef(null)

  // ** Hooks
  const dispatch = useDispatch()

  const handleFileUpload = e => {
    setLoadFileError('')
    if (e.target.files.length) {
      const inputFile = e.target.files[0]

      const fileExtension = inputFile?.type.split('/')[1]
      if (!allowedExtensions.includes(fileExtension)) {
        setLoadFileError('Please, enter a valid csv file')
        return
      }
      dispatch(handleLoadingSubscriptions(true))
      dispatch(loadSubscriptionsFromFile({ file: inputFile, callback: finishSyncCallback }))
    }
  }

  const handleClick = event => {
    hiddenFileInput.current.click()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const finishSyncCallback = (error, message) => {
    if (error) {
      setSyncError(true)
    }
    setMessageInfo(message)
    setOpen(true)
  }

  const handleAction = e => {
    handleMultipleAction(e.target.value)
    setActionValue('')
  }

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Select
        size='small'
        displayEmpty
        defaultValue=''
        value={actionValue}
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRows && selectedRows.length === 0}
        renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
        onChange={handleAction}
      >
        <MenuItem value='' disabled>
          Actions
        </MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
      </Select>
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 2, width: '30%', justifyContent: 'end' }}
      ></Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant='subtitle2' sx={{ color: false ? 'success.main' : 'error.main', mr: 4, mb: 2 }}>
          {loadFileError}
        </Typography>
        <Tooltip placement='top' title='Refresh Subscriptions'>
          <IconButton size='small' onClick={handleClick} sx={{ mr: 4, mb: 2, maxWidth: '180px' }}>
            <Reload sx={{ fontSize: '1.375rem' }} />
            <input
              onChange={handleFileUpload}
              id='csvInput'
              name='file'
              type='File'
              ref={hiddenFileInput}
              style={{ display: 'none' }}
            />
          </IconButton>
        </Tooltip>
        <TextField
          size='small'
          value={value}
          placeholder='Search Subscription'
          sx={{ mr: 4, mb: 2, maxWidth: '180px' }}
          onChange={e => handleFilter(e.target.value)}
        />
        <Link href='/apps/invoice/add' passHref>
          <Button sx={{ mb: 2 }} variant='contained'>
            Create Subscription
          </Button>
        </Link>
      </Box>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        message={messageInfo ? messageInfo.message : undefined}
      >
        <Alert elevation={3} variant='filled' onClose={handleClose} severity={syncError ? 'error' : 'success'}>
          {messageInfo}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TableHeader
