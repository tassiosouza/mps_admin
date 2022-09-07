// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import { styled } from "@mui/material/styles";

// ** Icons Imports
import AccountCancel from 'mdi-material-ui/AccountCancel'
import CarConnected from 'mdi-material-ui/CarConnected'
import PackageVariantClosed from 'mdi-material-ui/PackageVariantClosed'
import NewspaperMinus from 'mdi-material-ui/NewspaperMinus'

// ** React Imports
import { useEffect, useState } from 'react'
import { AssignStatus } from 'src/models'

const CardContentNoPadding = styled(CardContent)(`
  padding: 10;
  &:last-child {
    padding-bottom: 0;
  }
`);

const DashboardCard = (props) => {

  // ** Dashboars props
  const { store } = props

  // ** Dashboard States
  const [subscriptionsLeft, setSubscriptionsLeft] = useState('-')
  const [activedOrders, setActivedOrders] = useState('-')
  const [activedRoutes, setActivedRoutes] = useState('-')
  const [unassignedDrivers, setUnassignedDrivers] = useState('-')

  useEffect(() => {
    setSubscriptionsLeft(store.subscriptions.length)
    setActivedOrders(store.orders.length)
    setActivedRoutes(store.routes.length)
    setUnassignedDrivers(store.drivers.filter(driver => driver.assignStatus === AssignStatus.UNASSIGNED).length)
  }, [store])

  return (
    <Card fullWidth>
      <CardMedia sx={{backgroundPosition:'right'}}image='/images/cards/card-bg.png'>
        <CardHeader title='Logistic Dashboard' sx={{textAlign:'center', color:'#51AB3B'}}/>
        <CardContentNoPadding>
            <Grid container direction='column'>
              <Grid item xs={6} sx={{display:'flex', justifyContent:'space-between', pb:4, pl:5, pr:5}}>
                <Box sx={{justifyContent:'center', textAlign:'center'}}>
                  <PackageVariantClosed sx={{fontSize:22}}/>
                  <Typography component='div'>Actived Orders</Typography>
                  <Typography sx={{color:'#51AB3B'}}  display='inline'>{activedOrders}</Typography>
                </Box>
                <Box sx={{justifyContent:'center', textAlign:'center', pr:1}}>
                  <NewspaperMinus sx={{fontSize:22}}/>
                  <Typography component='div'>Subscriptions Left</Typography>
                  <Typography sx={{color:'#51AB3B'}}  display='inline'>{subscriptionsLeft}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sx={{display:'flex', justifyContent:'space-between', pb:5, pl:5, pr:5}}>
              <Box sx={{justifyContent:'center', textAlign:'center'}}>
                  <CarConnected sx={{fontSize:22}}/>
                  <Typography component='div'>Actived Routes</Typography>
                  <Typography sx={{color:'#51AB3B'}}  display='inline'>{activedRoutes}</Typography>
                </Box>
                <Box sx={{justifyContent:'center', textAlign:'center'}}>
                  <AccountCancel sx={{fontSize:22}}/>
                  <Typography component='div'>Unassigned Drivers</Typography>
                  <Typography sx={{color:'#51AB3B'}}  display='inline'>{unassignedDrivers}</Typography>
                </Box>
              </Grid>
            </Grid>
        </CardContentNoPadding>
      </CardMedia>
    </Card>
  )
}

export default DashboardCard
