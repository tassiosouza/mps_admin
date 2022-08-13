// ** React Imports
import { Fragment, useState, useEffect, forwardRef, useRef } from 'react'

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
import Button from '@mui/material/Button'
import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material'

// ** Icons Imports
import Send from 'mdi-material-ui/Send'
import Check from 'mdi-material-ui/Check'
import ChartPie from 'mdi-material-ui/ChartPie'
import Download from 'mdi-material-ui/Download'
import ArrowDown from 'mdi-material-ui/ArrowDown'
import Cancel from 'mdi-material-ui/Cancel'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import ContentCopy from 'mdi-material-ui/ContentCopy'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import ContentSaveOutline from 'mdi-material-ui/ContentSaveOutline'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { refreshLocations } from 'src/store/apps/routes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/routes/list/TableHeader'
import LocationsTableHeader from 'src/views/apps/routes/list/LocationsTableHeader'
import LocationsTable from 'src/views/apps/routes/list/LocationsTable'
import LocationsDialog from 'src/views/apps/routes/list/LocationsDialog'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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
        <Link href={`/apps/route/edit/${id}`} passHref>
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

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, fontSize: '1rem', width: 34, height: 34 }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns = [
  {
    flex: 0.1,
    field: 'number',
    minWidth: 80,
    headerName: '#',
    renderCell: ({ row }) => (
      <Link href={`/apps/route/preview/${row.number}`} passHref>
        <StyledLink>{`${row.number}`}</StyledLink>
      </Link>
    )
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'routeStatus',
    headerName: 'Active',
    renderCell: ({ row }) => {
      const { status } = row

      return (
          <div>
            {status == 'Actived' ? (<Check/>) : (<Cancel/>
            )}
          </div>
            
      )
    }
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 300,
    headerName: 'Client',
    renderCell: ({ row }) => {
      const { name, address } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {name}
            </Typography>
            <Typography noWrap variant='caption'>
              {address}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.12,
    minWidth: 100,
    field: 'total',
    headerName: 'Phone',
    renderCell: ({ row }) => <Typography variant='body2'>{row.phone}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'issuedDate',
    headerName: 'Date',
    renderCell: ({ row }) => <Typography variant='body2'>{
      new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(row.routeDate)}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'mealPlan',
    headerName: 'Meal Plan',
    renderCell: ({ row }) => {

    return (
      row.mealPlan !== 0 ? (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {row.mealPlan}
      </Typography>
      ) : (
        <CustomChip size='small' skin='light' color='success' label='Paid' />
      )
    )
    }
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
  const [openDialog, setOpenDialog] = useState(false)

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

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
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
          <Tooltip title='Delete route'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => dispatch(deleteroute(row.id))}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Inactivate route'>
            <Box>
              <Link href={`/apps/route/preview/${row.id}`} passHref>
                <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <Cancel />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
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
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} openDialog={handleOpenDialog} />
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
      <LocationsDialog
        open={openDialog}
        onClose={handleCloseDialog}>
      </LocationsDialog>
    </Grid>
  )
}

export default RoutesList
