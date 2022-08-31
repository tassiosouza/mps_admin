// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const DriversTableHeader = props => {
  // ** Props
  const { value, handleFilter } = props

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
      <Typography sx={{ p: 2, pl:4 }} variant='body'>
        Available Drivers
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default DriversTableHeader
