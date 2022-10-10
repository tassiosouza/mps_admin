// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const ClustersHeader = props => {
  // ** Props
  const { handleFilter } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'end'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          placeholder='Search'
          sx={{ mr: 4, mb: 2, maxWidth: '180px' }}
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default ClustersHeader
