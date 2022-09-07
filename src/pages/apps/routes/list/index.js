// ** Redux Imports
import { useSelector } from 'react-redux'


// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Routes App Component Imports
import RoutesList from 'src/views/apps/routes/list/RoutesList'
import DriversList from 'src/views/apps/routes/list/DriversList'
import DashboardCard from 'src/views/apps/routes/list/DashboardCard'

const RoutesPage = () => {

  // ** Redux
  const store = useSelector(state => state.routes)

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
      <Grid item xs={8.2}>
        <RoutesList store={store}/>
      </Grid>
      <Grid item xs={3.8}>
        <Grid container spacing={5}>
          <Grid item sx={{width:'100%'}}>
            <DashboardCard 
              store={store}
            />
          </Grid>
          <Grid item sx={{width:'100%'}}>
            <DriversList store={store}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RoutesPage