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
import { useDispatch, useSelector } from 'react-redux'
import { loadData, handleLoadingroutes } from 'src/store/apps/routes'

// ** Icons Import
import Reload from 'mdi-material-ui/Reload'

const DriversTableHeader = props => {
  // ** Props
  const { value, selectedRows, handleFilter, openDialog } = props

  const handleOpenDialog = () => {
    openDialog()
  }

  return (
    <Box
      sx={{
        pt: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:'space-between'
      }}
    > 
      <Typography sx={{p: 2, pl:4, color:'#51AB3B'}} variant='body'>
        Available Drivers
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search Driver'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default DriversTableHeader
