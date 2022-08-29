// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import CircleMedium from 'mdi-material-ui/CircleMedium'


// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import { RouteStatus } from 'src/models'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoutesAndOrders } from 'src/store/apps/routes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/routes/list/TableHeader'
import LocationsDialog from 'src/views/apps/routes/list/LocationsDialog'
import RoutesDialog from 'src/views/apps/routes/list/RoutesDialog'
import DeleteRouteDialog from 'src/views/apps/routes/list/DeleteRouteDialog'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

/* eslint-enable */
const RoutesList = (props) => {

  const { store } = props

  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [statusValue, setStatusValue] = useState('')
  const [locationValue, setLocationValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [openLocationsDialog, setOpenLocationsDialog] = useState(false)
  const [openRoutesDialog, setOpenRoutesDialog] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

  const defaultColumns = [
    {
      flex: 0.06,
      field: 'id',
      minWidth: 80,
      headerName: 'ID',
      renderCell: ({ row }) => <Typography variant='body2'>{row.id}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 100,
      field:'status',
      headerName: 'Status',
      renderCell: ({ row }) => 
      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        {toPascalCase(row.status)} 
        <CircleMedium sx={{color:getStatusColor(row.status)}}/>
      </Box>
    },
    {
      flex: 0.20,
      field: 'driver',
      minWidth: 120,
      headerName: 'Driver',
      renderCell: ({ row }) => <Typography variant='body2'>{getDriverName(row.driverID)}</Typography>
    },
    {
      flex: 0.07,
      minWidth: 80,
      field: 'orders',
      headerName: 'Orders',
      renderCell: ({ row }) => <Typography variant='body2'>{getRouteOrders(row.id).length}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 90,
      field: 'issuedDate',
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='body2'>{
        new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(row.routeDate)}</Typography>
    }
  ]
  /* eslint-disable */
  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`
    props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
    const updatedProps = { ...props }
    delete updatedProps.setDates
    return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  })

  const getRouteOrders = (routeID) => {
    if(routeID != '') {
      return store.orders.filter(order => {
        return order.assignedRouteID === routeID
      })
    }
    return []
  }

  // ** Redux
  const dispatch = useDispatch()

  useEffect(() => {
    // ** Fetch routes and orders from server
    dispatch(fetchRoutesAndOrders({q: value, dates, status:statusValue}))
  }, [dispatch, dates, statusValue, value])

  const handleFilter = val => {
    setValue(val)
  }

  const getDriverName = driverID => {
    const drivers = store.drivers.filter(dr => dr.id === driverID)
    if(drivers.length) {
      return drivers[0].name
    }
    return 'Unassigned'
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleOpenLocationsDialog = () => {
    setOpenLocationsDialog(true)
  }

  const handleOpenRoutesDialog = (route) => {
    setSelectedRoute(route)
    setOpenRoutesDialog(true)
  }

  const handleOpenDeleteConfirm = (route) => {
    setSelectedRoute(route)
    setOpenDeleteConfirm(true)
  }

  const handleCloseLocationsDialog = () => {
    setOpenLocationsDialog(false)
  }

  const handleCloseRoutesDialog = () => {
    setOpenRoutesDialog(false)
  }

  const handleDeleteConfirm = route => {
    if(route) {
      dispatch(fetchRoutesAndOrders({q: value, dates, status:statusValue}))
      setOpenDeleteConfirm(false)
    }
    else {
      console.log('ERROR: The delete operation failed')
    }
  }

  const handleCloseConfirmDialog = () => {
    setOpenDeleteConfirm(false)
  }

  const toPascalCase = (text) => {
    text = text.replace('_', ' ')
    return text.replace(/(\w)(\w*)/g,
        function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
  }

  const getStatusColor = (status) => {
    switch(status) {
      case RouteStatus.PLANNED:
        return '#51AB3B'
      case RouteStatus.ASSIGNED:
        return '#e0d53a'
      case RouteStatus.CHECKING_BAGS:
        return '#4d3ae0'
      case RouteStatus.IN_TRANSIT:
        return '#dd3ae0'
      case RouteStatus.DONE:
        return '#3ac4e0'
      case RouteStatus.CANCELED:
        return '#e03d3a'
      default:
        return '#e03d3a'
    }
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.11,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Route'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleOpenDeleteConfirm(row)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='View Route'>
            <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }} onClick={() => handleOpenRoutesDialog(row)}>
              <EyeOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Export Route'>
            <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }} onClick={() => {}}>
              <DownloadOutline />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='route-status-select'>Route Status</InputLabel>
                  <Select
                    fullWidth
                    value={statusValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='route Status'
                    onChange={handleStatusValue}
                    labelId='route-status-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='PLANNED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.PLANNED)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.PLANNED)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='ASSIGNED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.ASSIGNED)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.ASSIGNED)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='CHECKING_BAGS'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.CHECKING_BAGS)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.CHECKING_BAGS)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='IN_TRANSIT'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.IN_TRANSIT)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.IN_TRANSIT)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='DONE'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.DONE)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.DONE)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='CANCELED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(RouteStatus.CANCELED)} 
                        <CircleMedium sx={{color:getStatusColor(RouteStatus.CANCELED)}}/>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='route-location-select'>Route Location</InputLabel>
                  <Select
                    fullWidth
                    value={locationValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='route Location'
                    // onChange={handleLocationValue}
                    labelId='route-location-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    {/* {store.locations.map((location, index) => <MenuItem key={index} value={location} >{location}</MenuItem>)} */}
                    
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePickerWrapper>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Route Date'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} openDialog={handleOpenLocationsDialog} />
          {store.loadingRoutes && <LinearProgress sx={{ height:'2px' }} />}
          <DataGrid
            autoHeight
            pagination
            rows={store.routes}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <LocationsDialog
        open={openLocationsDialog}
        onClose={handleCloseLocationsDialog}
      />
      <RoutesDialog 
        open={openRoutesDialog}
        onClose={handleCloseRoutesDialog}
        route={selectedRoute}
        orders={store.orders}
      />
      <DeleteRouteDialog 
        route={selectedRoute}
        orders={getRouteOrders(selectedRoute ? selectedRoute.id : '')}
        open={openDeleteConfirm}
        onDelete={handleDeleteConfirm}
        onCancel={handleCloseConfirmDialog}>
      </DeleteRouteDialog>
    </Grid>
  )
}

export default RoutesList
