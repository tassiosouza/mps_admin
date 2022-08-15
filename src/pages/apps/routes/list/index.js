// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Routes App Component Imports
import RoutesList from 'src/views/apps/routes/list/RoutesList'
import DriversList from 'src/views/apps/routes/list/DriversList'

const RoutesPage = () => {

  // ** States
  const [query, setQuery] = useState('')

  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {

  }, [dispatch, query])

  return (
    <Grid 
      container
      spacing={5}
      sx={{
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    > 
      <Grid item xs={8}>
        <RoutesList/>
      </Grid>
      <Grid item xs={4}>
        <Grid container spacing={5}>
          <Grid item sx={{width:'100%'}}>
            <Card fullWidth>
              <CardHeader title='Routes Summary' />
              <CardContent>
                <Box>
                <Typography component='div'>Actived Routes :
                  <Box sx={{color:'#51AB3B'}}  display='inline'>  13 </Box>
                </Typography>
                <Typography component='div'>Pending Routes:
                  <Box sx={{color:'#51AB3B'}}  display='inline'>  3 </Box>
                </Typography>
                <Typography component='div'>Unassigned Drivers:
                  <Box sx={{color:'#51AB3B'}}  display='inline'>  7 </Box>
                </Typography>
                <Typography component='div'>Completed Routes:
                  <Box sx={{color:'#51AB3B'}}  display='inline'>  5 </Box>
                </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sx={{width:'100%'}}>
            <DriversList/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RoutesPage
