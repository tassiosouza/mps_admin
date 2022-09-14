// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

// ** Icons Import
import Reload from 'mdi-material-ui/Reload'

// ** React Imports
import { useState } from 'react'

const TableHeader = props => {
  // ** Props
  const { value, selectedRoutes, handleFilter, openDialog, refresh, handleMultipleAction } = props

  const [actionValue, setActionValue] = useState('')

  const handleOpenDialog = () => {
    openDialog()
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
        justifyContent: 'space-between',
      }}
    >
      <Select
        size='small'
        displayEmpty
        defaultValue=''
        value={actionValue}
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRoutes && selectedRoutes.length === 0}
        renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
        onChange={handleAction}
      >
        <MenuItem value='' disabled>
          Actions
        </MenuItem>
        <MenuItem value='View'>View</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Dowload'>Download</MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip placement='top' title='Refresh Orders'>
          <IconButton size='small' onClick={() => refresh()} sx={{ mr: 4, mb: 2, maxWidth: '180px'}}>
            <Reload sx={{fontSize: '1.375rem'}}/>
          </IconButton>
        </Tooltip>
        <TextField
          size='small'
          value={value}
          placeholder='Search Route'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2}} variant='contained' onClick={handleOpenDialog}>
          New Routes Optimization
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
