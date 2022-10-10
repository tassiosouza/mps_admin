// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const LocationsTableHeader = props => {
  // ** Props
  const { handleFilter, selectedClusters } = props

  return (
    <Box
      sx={{
        p: 5,
        pr: 0,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {selectedClusters.length > 0 ? selectedClusters.length + ' Clusters selecteds' : 'Select Clusters'}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField size='small' placeholder='Search' sx={{ mb: 2 }} onChange={e => handleFilter(e.target.value)} />
      </Box>
    </Box>
  )
}

export default LocationsTableHeader
