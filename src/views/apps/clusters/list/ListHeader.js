// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** Icons Imports
import Plus from 'mdi-material-ui/Plus'

const ListHeader = props => {
  // ** Props
  const { value, handleFilter } = props

  return (
    <Card
      sx={{
        pt: 5,                  
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:'space-between'
      }}
    > 
      <Typography sx={{ pt: 1, pl:4 }} variant='h6'>
        Clusters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{height:'fit-content', mr:4 }} variant='contained' color='primary' startIcon={<Plus/>}>
            Add
        </Button>
      </Box>
    </Card>
  )
}

export default ListHeader
