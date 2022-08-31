// ** React Imports
import { Fragment, useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
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
import Check from 'mdi-material-ui/Check'
import Download from 'mdi-material-ui/Download'
import Cancel from 'mdi-material-ui/Cancel'
import ContentCopy from 'mdi-material-ui/ContentCopy'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import CircleMedium from 'mdi-material-ui/CircleMedium'
import ImageOutline from 'mdi-material-ui/ImageOutline'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders, deleteOrder, handleLoadingOrders } from 'src/store/apps/orders'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/orders/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { OrderStatus } from 'src/models'
import OrderDialog from 'src/views/apps/orders/list/OrderDialog'

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const RowOptions = ({ id }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem>
          <Download fontSize='small' sx={{ mr: 2 }} />
          Download
        </MenuItem>
        <Link href={`/apps/subscription/edit/${id}`} passHref>
          <MenuItem>
            <PencilOutline fontSize='small' sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        </Link>
        <MenuItem>
          <ContentCopy fontSize='small' sx={{ mr: 2 }} />
          Duplicate
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

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
const OrderList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [statusValue, setStatusValue] = useState('')
  const [locationValue, setLocationValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [openOrderDialog, setOpenOrderDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.orders)
  useEffect(() => {
    refresh()
  }, [dispatch, statusValue, locationValue, value, dates])

  const refresh = () => {
    dispatch(handleLoadingOrders(true))
    dispatch(
      fetchOrders({
        dates,
        q: value,
        status: statusValue,
        location: locationValue
      })
    )
  }

  const handleCloseDialog = () => {
    setOpenOrderDialog(false)
  }

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

  const toPascalCase = (text) => {
    text = text.replace('_', ' ')
    
    return text.replace(/(\w)(\w*)/g,
        function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
  }

  const getStatusColor = (status) => {
    switch(status) {
      case OrderStatus.CREATED:
        return '#51AB3B'
      case OrderStatus.CHECKED:
        return '#e0d53a'
      case OrderStatus.IN_TRANSIT:
        return '#dd3ae0'
      case OrderStatus.DELIVERED:
        return '#3ac4e0'
      case OrderStatus.CANCELED:
        return '#e03d3a'
      default:
        return '#e03d3a'
    }
  }

  const handleOpenDialogOrder = (order) => {
    setSelectedOrder(order)
    setOpenOrderDialog(true)
  }

  const defaultColumns = [
    {
      flex: 0.05,
      field: 'id',
      minWidth: 70,
      headerName: 'ID',
      renderCell: ({ row }) => (
        <Link href={`/apps/orders/preview/${row.id}`} passHref>
          <StyledLink>{`${row.id}`}</StyledLink>
        </Link>
      )
    },
    {
      flex: 0.08,
      minWidth: 80,
      field: 'subscriptionID',
      headerName: 'Sub. ID',
      renderCell: ({ row }) => {
        return ( 
          <Tooltip placement='top' title={row.subscriptionID}>
            <Typography variant='body2'>{row.subscriptionID}</Typography>
          </Tooltip>
          )
      }
    },
    {
      flex: 0.06,
      minWidth: 100,
      field: 'routeID',
      headerName: 'Route',
      renderCell: ({ row }) => 
      <Typography variant='body2'>{row.assignedRouteID}</Typography>
    },
    {
      flex: 0.09,
      minWidth: 80,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => {
        return (
          <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
            {toPascalCase(row.status)} 
            <CircleMedium sx={{color:getStatusColor(row.status)}}/>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'name',
      minWidth: 300,
      headerName: 'Client',
      renderCell: ({ row }) => {
        const { customerName } = row
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {customerName}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: 'issuedDate',
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='body2'>{
        new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(row.subscriptionDate)}</Typography>
    },
    {
      flex: 0.09,
      minWidth: 100,
      field: 'eta',
      headerName: 'Arrival Time',
      renderCell: ({ row }) => {
        return (
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            4:43pm
          </Typography>
        )
      }
    }
  ]

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
          <Tooltip title='Delete Order'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => {}}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          { row.status === OrderStatus.DELIVERED && 
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleOpenDialogOrder(row)}>
              <ImageOutline />
            </IconButton>
          }
          <RowOptions id={row.id} />
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
                  <InputLabel id='subscription-status-select'>Order Status</InputLabel>

                  <Select
                    fullWidth
                    value={statusValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='Order Status'
                    onChange={handleStatusValue}
                    labelId='subscription-status-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='CREATED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(OrderStatus.CREATED)} 
                        <CircleMedium sx={{color:getStatusColor(OrderStatus.CREATED)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='CHECKED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(OrderStatus.CHECKED)} 
                        <CircleMedium sx={{color:getStatusColor(OrderStatus.CHECKED)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='IN_TRANSIT'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(OrderStatus.IN_TRANSIT)} 
                        <CircleMedium sx={{color:getStatusColor(OrderStatus.IN_TRANSIT)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='DELIVERED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(OrderStatus.DELIVERED)} 
                        <CircleMedium sx={{color:getStatusColor(OrderStatus.DELIVERED)}}/>
                      </Box>
                    </MenuItem>
                    <MenuItem value='CANCELED'>
                      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                        {toPascalCase(OrderStatus.CANCELED)} 
                        <CircleMedium sx={{color:getStatusColor(OrderStatus.CANCELED)}}/>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='subscription-location-select'>Order Location</InputLabel>
                  <Select
                    fullWidth
                    value={locationValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='Order Location'
                    onChange={handleLocationValue}
                    labelId='subscription-location-select'
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
                        label='Order Date'
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
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} refresh={refresh} />
          {store.loading && <LinearProgress sx={{ height:'2px' }} />}
          <DataGrid
            autoHeight
            pagination
            rows={store.data}
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
      <OrderDialog 
        open={openOrderDialog}
        onClose={handleCloseDialog}
        order={selectedOrder}>
      </OrderDialog>
    </Grid>
  )
}

export default OrderList
