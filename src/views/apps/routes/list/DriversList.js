// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import OutlinedInput from '@mui/material/OutlinedInput'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import Check from 'mdi-material-ui/Check'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Repository Imports
import { fetchDrivers, setAssigningDriver, assignDriver, unassignDriver } from 'src/store/apps/routes'
import { AssignStatus } from 'src/models'

// ** Custom Components Imports
import DriversTableHeader from 'src/views/apps/routes/list/DriversTableHeader'

// ** Third Party Styles Imports
import Popup from 'reactjs-popup';
import ReactLoading from "react-loading";
import 'reactjs-popup/dist/index.css';

const defaultColumns = [
  {
    flex: 1.25,
    field: 'name',
    minWidth: 140,
    headerName: 'Name'
  }
]

const DriverActions = (props) => {

  const {driver, handleRouteAssignment, handleUnassign} = props

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleAssignment = (routeID, driverID) => {
    handleCloseMenu()
    handleRouteAssignment(routeID, driverID)
  }

  const handleUnassignment = (driverID) => {
    handleCloseMenu()
    handleUnassign(driverID)
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {driver.assignStatus == AssignStatus.ASSIGNING && (
            <Box sx={{ ml: 2, mr: 2, color:'#51AB3B'}}>
              <ReactLoading type={'spokes'} width='20px' height='20px' color="#51AB3B"/>
            </Box>
          )}
          {driver.assignStatus == AssignStatus.UNASSIGNED && 
            <Popup 
            trigger={
              <IconButton size='small' sx={{ mr: 0.5}}>    
                <PlusCircleOutline/>
              </IconButton>
            }
            position="left center">
              <OutlinedInput
                variant={'standard'}
                size='small'
                placeholder='Route Id'
                sx={{ maxWidth: '180px' }}
                onKeyDown={e => handleAssignment(e, driver.id)}
              />
              
            </Popup>
          }
          {driver.assignStatus == AssignStatus.ASSIGNED && <Check sx={{textDecoration: 'none', mr: 2, ml: 1, color:"#51AB3B"}}/>}
          <div>
            <IconButton size='small' component='a' sx={{ textDecoration: 'none' }} onClick={handleClick}>
              <DotsVertical/>
            </IconButton>
            <Menu keepMounted id='simple-menu' anchorEl={anchorEl} onClose={handleCloseMenu} open={Boolean(anchorEl)}>
                <MenuItem disabled={driver.assignStatus != AssignStatus.ASSIGNED} onClick={() => handleUnassignment(driver.id)}>Unassign</MenuItem>
                <MenuItem onClick={handleCloseMenu}>View</MenuItem>
                <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
            </Menu>
          </div>
        </Box>
  )
}

/* eslint-enable */
const DriversList = (props) => {

  const { store } = props

  const ASSIGN_SUCCESS_MESSAGE = "Driver assigned successfully"

  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [statusValue, setStatusValue] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [messageInfo, setMessageInfo] = useState('')

  // ** Redux
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDrivers({query: value}))
  }, [dispatch, statusValue, value])

  const handleFilter = val => {
    setValue(val)
  }

  const handleRouteAssignment = (e, driverID) => {
    if(e.keyCode == 13) {
      const routeID = e.target.value
       dispatch(setAssigningDriver({driverID}))
       dispatch(assignDriver({routeID, driverID, callback: assignDriverCallback}))
    }
  }

  const handleUnassign = (driverID) => {
    dispatch(setAssigningDriver({driverID}))

    const routes = store.routes.filter(route => route.driverID === driverID)
    if(routes.length) {
      const routeID = routes[0].id
      dispatch(unassignDriver({routeID, driverID, callback: assignDriverCallback}))
    }
    else {
      console.log('ERROR: Driver not assigned')
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const assignDriverCallback = (error) => {
    setOpenSnackbar(true)
    // ** Set error message in snackbar
    if(error) {
      setMessageInfo(error)
    }
    else {
      // ** Set message to blank will show success message on snackbar 
      setMessageInfo('')
    }
  } 

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <DriverActions
          driver={row}
          handleRouteAssignment={handleRouteAssignment}
          handleUnassign={handleUnassign}/>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DriversTableHeader value={value} handleFilter={handleFilter}/>
          {store.loading && <LinearProgress sx={{ height:'2px' }} />}
          <DataGrid
            autoHeight
            pagination
            rows={store.drivers}
            columns={columns}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': {borderRadius: 0 } }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
      >
        <Alert
          elevation={3}
          variant='filled'
          onClose={handleCloseSnackbar}
          severity={messageInfo != '' ? 'error' : 'success'}
        >
          {messageInfo != '' ? messageInfo : ASSIGN_SUCCESS_MESSAGE}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default DriversList
