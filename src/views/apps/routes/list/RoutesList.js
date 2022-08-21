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

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/routes/list/TableHeader'
import LocationsDialog from 'src/views/apps/routes/list/LocationsDialog'
import RoutesDialog from 'src/views/apps/routes/list/RoutesDialog'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const defaultColumns = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 80,
    headerName: 'ID',
    renderCell: ({ row }) => <Typography variant='body2'>{row.id}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'routeStatus',
    headerName: 'Status',
    renderCell: ({ row }) => <Typography variant='body2'>{row.status}</Typography>
  },
  {
    flex: 0.20,
    field: 'driver',
    minWidth: 120,
    headerName: 'Driver',
    renderCell: ({ row }) => <Typography variant='body2'>{'Unassigned'}</Typography>
  },
  {
    flex: 0.12,
    minWidth: 100,
    field: 'location',
    headerName: 'Location',
    renderCell: ({ row }) => <Typography variant='body2'>{row.location}</Typography>
  },
  {
    flex: 0.10,
    minWidth: 70,
    field: 'orders',
    headerName: 'Orders',
    renderCell: ({ row }) => <Typography variant='body2'>{row.orders.length}</Typography>
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

/* eslint-enable */
const RoutesList = () => {
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

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)

  useEffect(() => {
  }, [dispatch, dates, statusValue, value])

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleLocationValue = e => {
    setLocationValue(e.target.value)
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

  const handleOpenRoutesDialog = row => {
    setSelectedRoute(row)
    setOpenRoutesDialog(true)
  }

  const handleCloseLocationsDialog = () => {
    setOpenLocationsDialog(false)
  }

  const handleCloseRoutesDialog = () => {
    setOpenRoutesDialog(false)
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Route'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => dispatch(deleteroute(row.id))}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='View Route'>
            <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }} onClick={() => handleOpenRoutesDialog(row)}>
              <EyeOutline />
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
                    <MenuItem value='Actived'>Actived</MenuItem>
                    <MenuItem value='Canceled'>Canceled</MenuItem>
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
                    onChange={handleLocationValue}
                    labelId='route-location-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    {store.locations.map((location, index) => <MenuItem key={index} value={location} >{location}</MenuItem>)}
                    
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
          {store.loading && <LinearProgress sx={{ height:'2px' }} />}
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
      />
    </Grid>
  )
}

export default RoutesList
