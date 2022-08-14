// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Routes App Component Imports
import MailLog from 'src/views/apps/email/MailLog'
import SidebarLeft from 'src/views/apps/email/SidebarLeft'
import ComposePopup from 'src/views/apps/email/ComposePopup'
import RoutesList from 'src/views/apps/routes/list/RoutesList'
import DriversList from 'src/views/apps/routes/list/DriversList'

// ** Actions
import {
  fetchMails,
  updateMail,
  paginateMail,
  getCurrentMail,
  updateMailLabel,
  handleSelectMail,
  handleSelectAllMail
} from 'src/store/apps/email'

// ** Variables
const labelColors = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

const RoutesPage = ({ folder, label }) => {
  // ** States
  const [query, setQuery] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [mailDetailsOpen, setMailDetailsOpen] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector(state => state.email)

  // ** Vars
  const leftSidebarWidth = 260
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'
  const { skin, appBar, footer, layout, navHidden, direction } = settings

  const routeParams = {
    label: label || '',
    folder: folder || 'inbox'
  }
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchMails({ q: query || '', folder: routeParams.folder, label: routeParams.label }))
  }, [dispatch, query, routeParams.folder, routeParams.label])
  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const calculateAppHeight = () => {
    return `(${
      (appBar === 'hidden' ? 0 : theme.mixins.toolbar.minHeight) * (layout === 'horizontal' && !navHidden ? 2 : 1) +
      (footer === 'hidden' ? 0 : 56)
    }px + ${theme.spacing(6)} * 2)`
  }

  return (
    <Grid 
      container
      spacing={5}
      sx={{
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
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
