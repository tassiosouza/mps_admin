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
import { styled } from '@mui/material/styles'

// ** Icons Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import CircleMedium from 'mdi-material-ui/CircleMedium'


// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import { RouteStatus } from 'src/models'

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'
import { fetchLocations, fetchRoutesAndOrders, setLoadingRoutes } from 'src/store/apps/routes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/routes/list/TableHeader'
import LocationsDialog from 'src/views/apps/routes/list/LocationsDialog'
import RoutesDialog from 'src/views/apps/routes/list/RoutesDialog'
import DeleteRouteDialog from 'src/views/apps/routes/list/DeleteRouteDialog'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { saveAs } from "file-saver"
import XlsxPopulate from "xlsx-populate"
import { Player } from '@lottiefiles/react-lottie-player';

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

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
  const [selectedRoutes, setSelectedRoutes] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [openLocationsDialog, setOpenLocationsDialog] = useState(false)
  const [openRoutesDialog, setOpenRoutesDialog] = useState(false)
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

  const defaultColumns = [
    {
      flex: 0.06,
      field: 'id',
      minWidth: 80,
      headerName: 'ID',
      renderCell: ({ row }) => <StyledLink onClick={() => handleOpenRoutesDialog(row)}>{row.id}</StyledLink>
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
      renderCell: ({ row }) => 
      <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
        <Typography variant='body2'>{getDriverName(row.driverID)}</Typography>
        {row.status == RouteStatus.IN_TRANSIT && <Player
          autoplay
          loop
          src={'https://assets6.lottiefiles.com/packages/lf20_buuuwhvb.json'}
          style={{ height: '25px', width: '25px' }}
        />}
      </Box>
    },
    {
      flex: 0.07,
      minWidth: 80,
      field: 'orders',
      headerName: 'Orders',
      renderCell: ({ row }) => <Typography variant='body2'>{getRouteOrders(row.id).length}</Typography>
    },
    {
      flex: 0.07,
      minWidth: 80,
      field: 'cost',
      headerName: 'Cost',
      renderCell: ({ row }) => <Typography variant='body2'>${parseInt(row.cost)}</Typography>
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
    refresh()
  }, [dispatch, dates, statusValue, value])

  const refresh = () => {
    dispatch(setLoadingRoutes(true))
    dispatch(fetchRoutesAndOrders({q: value, dates, status:statusValue}))
  }

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
  
  const getDriversNames = routes => {
    var result = []
    routes.map(route => {
      const drivers = store.drivers.filter(dr => dr.id === route.driverID)
      if(drivers.length) {
        result.push(drivers[0].name)
      }
    })
    return result
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
    setSelectedRoutes([route])
    setOpenRoutesDialog(true)
  }

  const handleOpenDeleteConfirm = (route) => {
    setSelectedRoutes([route])
    setOpenDeleteConfirm(true)
  }

  const handleCloseLocationsDialog = () => {
    setOpenLocationsDialog(false)
  }

  const handleCloseRoutesDialog = () => {
    setOpenRoutesDialog(false)
    setSelectedRoutes([])
  }

  const handleDeleteConfirm = route => {
    if(route) {
      dispatch(fetchRoutesAndOrders({q: value, dates, status:statusValue}))
      dispatch(fetchLocations({q: ''}))
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
        function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase()})
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

  const handleMultipleAction = action => {
    switch(action) {
      case "View": 
        setOpenRoutesDialog(true)
      break
      case "Download":
        saveAsExcel(selectedRoutes)
        setSelectedRoutes([])
      break
      case "Delete":
        setOpenDeleteConfirm(true)
      break
      default:
      break
    }
  }

  const getFixedWidth = (width) => {
    return (width * 21) / 126
  }

  async function saveAsExcel(routes) {
    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
      for(var i = 0; i < routes.length; i++) {
        const sheet = workbook.addSheet(routes[i].id);
        const routeOrders = getRouteOrders(routes[i].id)
        routeOrders.sort((a, b) => a.sort - b.sort)
        const routeDriverName = getDriverName(routes[i].driverID)

        var date = new Date(routes[i].routeDate);
        const formattedDate = date.toLocaleString('default', { day: 'numeric', month: 'short', year:'numeric' })

        // ** Build Spreadsheet Header ****************************************************
        // ** Set Sheet Cells Sizes
        sheet.column("A").width(getFixedWidth(61))
        sheet.column("B").width(getFixedWidth(25))
        sheet.column("C").width(getFixedWidth(237))
        sheet.column("D").width(getFixedWidth(250))
        sheet.column("E").width(getFixedWidth(100))
        sheet.column("F").width(getFixedWidth(283))
        sheet.row("1").height(24)
        sheet.row("2").height(24)
        sheet.row("3").height(24)
        sheet.row("4").height(24)
        sheet.row("5").height(24)

        // ** Merge Header Cells
        workbook.sheet(routes[i].id).range("B1:D1").merged(true)
        workbook.sheet(routes[i].id).range("B2:D2").merged(true)
        workbook.sheet(routes[i].id).range("B3:D3").merged(true)
        workbook.sheet(routes[i].id).range("A4:D4").merged(true)

        // ** Manage Header Cells Colors
        sheet.range("A1:F1").style({fill:"FFFFFF", border: true, borderColor:"FFFFFF"})
        sheet.range("A2:F2").style({fill:"e6ecec", border: true, borderColor:"bfbfbf"})
        sheet.range("A3:F3").style({fill:"e6ecec", border: true, borderColor:"bfbfbf"})
        sheet.range("A4:F4").style({fill:"e6ecec", border: true, borderColor:"bfbfbf"})
        sheet.range("A5:F5").style({fill:"7cc465", border: true, borderColor:"bfbfbf"})
        
        // ** Build Spreadsheet Header ****************************************************

        // ** Manage Header Cells Values
        sheet.cell("A2").value(routes[i].id)
        sheet.cell("B2").value(routes[i].location)
        sheet.cell("E2").value('ORDERS')
        sheet.cell("F2").value(formattedDate)
        
        sheet.cell("A3").value('DRIVER')
        sheet.cell("B3").value(routeDriverName)
        sheet.cell("E3").value(routeOrders.length)

        sheet.cell("A4").value('AMOUNT OF BAGS  >>')
        sheet.cell("A4").style({horizontalAlignment: 'right'})
        sheet.cell("E4").value(routeOrders.length)
        sheet.cell("F4").value('5:10')

        sheet.cell("A5").value('N.')
        sheet.cell("D5").value('1 ICE PACKS PER BAG')
        sheet.cell("E5").value('PHONE #')
        sheet.cell("F5").value('ADDRESS / NOTES')

        const currentRow = 6

        routeOrders.map(order => {
          sheet.row(currentRow).height(24)

          sheet.cell("A" + currentRow).value(order.sort + '°')
          sheet.cell("C" + currentRow).value(" " + order.customerName + " (" + order.number + ") ")
          sheet.cell("C" + currentRow).style({fill:"ffffff", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'left', verticalAlignment: 'center' })
          sheet.cell("D" + currentRow).value(" " + order.customerName + " (" + order.number + ") ")
          sheet.cell("D" + currentRow).style({fill:"ffffff", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'left', verticalAlignment: 'center' })
          sheet.cell("E" + currentRow).value(order.phone)
          sheet.cell("E" + currentRow).style({fill:"ffffff", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'center', verticalAlignment: 'center' })
          sheet.cell("F" + currentRow).value(" " + order.address)
          sheet.cell("F" + currentRow).style({fill:"ffffff", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'left', verticalAlignment: 'center' })

          workbook.sheet(routes[i].id).range("A"+currentRow+ ":A" + (currentRow+1)).merged(true)
          workbook.sheet(routes[i].id).range("B"+currentRow+ ":B" + (currentRow+1)).merged(true)
          sheet.cell("A" + currentRow).style({fill:"ffffff", border: true, borderColor:"bfbfbf", fontSize:15, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'center', verticalAlignment: 'center' })
          currentRow += 1
          if(order.mealPlan.length < 10){
            sheet.cell("C" + currentRow).style({fill:"ececec", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'left', verticalAlignment: 'center' })
            sheet.cell("D" + currentRow).style({fill:"ececec", border: true, borderColor:"bfbfbf", fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'left', verticalAlignment: 'center' })
            
            sheet.cell("C" + currentRow).value(' ' + order.mealPlan + '\r\n')
            sheet.cell("D" + currentRow).value(' ' + order.mealPlan + '\r\n')

          }
          else {
            sheet.cell("C" + currentRow).style({fill:"ececec", border: true, borderColor:"bfbfbf", fontSize:10, fontFamily: 'Helvetica Neue', bold: false, horizontalAlignment: 'left', verticalAlignment: 'center' })
            sheet.cell("D" + currentRow).style({fill:"ececec", border: true, borderColor:"bfbfbf", fontSize:10, fontFamily: 'Helvetica Neue', bold: false, horizontalAlignment: 'left', verticalAlignment: 'center' })
          
            sheet.cell("C" + currentRow).value('\r\n' + order.mealPlan + '\r\n')
            sheet.cell("D" + currentRow).value('\r\n' + order.mealPlan + '\r\n')
          }

          if(order.deliveryInstruction.length < 10 && order.mealPlan.length < 10) sheet.row(currentRow).height(24)

          sheet.cell("F" + currentRow).style({fill:"ececec", wrapText:true, border: true, borderColor:"bfbfbf", fontSize:12, fontFamily: 'Times New Roman', bold: false, horizontalAlignment: 'left', verticalAlignment: 'center' })

          if(order.deliveryInstruction != '0')sheet.cell("F" + currentRow).value(" " + order.deliveryInstruction)
          sheet.range("C" + currentRow + ":F" + currentRow).style({fill:"ececec", border: true, borderColor:"bfbfbf"})

          currentRow += 1
        })

        sheet.range("A1:F" + 5).style({fontSize:13, fontFamily: 'Times New Roman', bold: true, horizontalAlignment: 'center', verticalAlignment: 'center' })
        sheet.cell("A4").style({horizontalAlignment: 'right'})
      }
      workbook.deleteSheet(0);
      return workbook.outputAsync().then((res) => {
        if(routes.length == 1) {
          saveAs(res, routes[0].id + ".xlsx")
        }
        else {
          saveAs(res, "MPS - System Routes.xlsx")
        }
      })
    })
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Route'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleOpenDeleteConfirm(row)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Export Route'>
          <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }} onClick={() => saveAsExcel([row])}>
            <DownloadOutline />
            </IconButton>
          </Tooltip>
        </Box>
      )}
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
          <TableHeader 
            value={value} 
            selectedRoutes={selectedRoutes} 
            handleFilter={handleFilter} 
            openDialog={handleOpenLocationsDialog}
            refresh={refresh} 
            handleMultipleAction={handleMultipleAction}/>
          {store.loadingRoutes && <LinearProgress sx={{ height:'2px' }} />}
          <DataGrid
            autoHeight
            pagination
            rows={store.routes}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            selectionModel={selectedRoutes.map(route => route.id)}
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = store.routes.filter((route) =>
                selectedIDs.has(route.id.toString())
              )
              setSelectedRoutes(selectedRowData)
            }}
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
        routes={selectedRoutes}
        orders={store.orders}
        drivers={getDriversNames(selectedRoutes)}
      />
      <DeleteRouteDialog 
        routes={selectedRoutes}
        orders={store.orders}
        open={openDeleteConfirm}
        onDelete={handleDeleteConfirm}
        onCancel={handleCloseConfirmDialog}>
      </DeleteRouteDialog>
    </Grid>
  )
}

export default RoutesList
