// ** Next Import
import Link from 'next/link'

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

const TableHeader = props => {
  
  // ** Props
  const { value, selectedRows, handleFilter, refresh } = props

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
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRows && selectedRows.length === 0}
        renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
      >
        <MenuItem value='' disabled>
          Actions
        </MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Send'>Send</MenuItem>
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
          placeholder='Search Order'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
        <Link href='/apps/invoice/add' passHref>
          <Button sx={{ mb: 2}} variant='contained'>
            Create Order
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default TableHeader
