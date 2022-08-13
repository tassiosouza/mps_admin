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

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Icons Import
import Reload from 'mdi-material-ui/Reload'

const LocationsTableHeader = props => {
  // ** Props
  const { value, handleFilter, selectedLocations } = props

  return (
    <Box
      sx={{
        p: 2,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedLocations.map(location => {
          return (<CustomChip size='small' sx={{m:0.5}} skin='light' color='primary' label={location.name} />)
        })}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search Location'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
          <Button sx={{ mb: 2}} variant='contained'>
            Include All
          </Button>
      </Box>
    </Box>
  )
}

export default LocationsTableHeader
