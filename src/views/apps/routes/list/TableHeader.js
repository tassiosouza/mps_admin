// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

const TableHeader = props => {
  // ** Props
  const { value, selectedRows, handleFilter, openDialog } = props

  const handleOpenDialog = () => {
    openDialog()
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
