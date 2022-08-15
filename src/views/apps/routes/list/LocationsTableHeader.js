// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

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
