// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import OutlinedInput from '@mui/material/OutlinedInput'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import Check from 'mdi-material-ui/Check'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Repository Imports
import { fetchDrivers, setAssigningDriver, assignDriver } from 'src/store/apps/routes'
import { AssignStatus } from 'src/models'

// ** Custom Components Imports
import DriversTableHeader from 'src/views/apps/routes/list/DriversTableHeader'

// ** Third Party Styles Imports
import Popup from 'reactjs-popup';
import ReactLoading from "react-loading";
import 'reactjs-popup/dist/index.css';

const defaultColumns = [
  {
    flex: 0.25,
    field: 'name',
    minWidth: 240,
    headerName: 'Name',
    renderCell: ({ row }) => {<Typography variant='body2'>row.name</Typography>}
  }
]

/* eslint-enable */
const DriversList = () => {
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [statusValue, setStatusValue] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [messageInfo, setMessageInfo] = useState('')

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)
  

  useEffect(() => {
    dispatch(fetchDrivers({query: value}))
  }, [dispatch, statusValue, value])

  const handleFilter = val => {
    setValue(val)
  }

  const handleRouteAssignment = (e, driverID) => {
    if(e.keyCode == 13) {
      const routeID = e.target.value
       console.log('assign driver: ' + driverID + ' to route: ' +  e.target.value)
       dispatch(setAssigningDriver({driverID}))
       dispatch(assignDriver({routeID, driverID, callback: assignDriverCallback}))
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const assignDriverCallback = (error) => {
    setOpenSnackbar(true)
    if(error) {
      setMessageInfo(error)
      console.log(error)
    }
    else {
      console.log('sucess')
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.assignStatus == AssignStatus.ASSIGNING && <ReactLoading type={'spokes'} width='20px' height='20px' color="#51AB3B" />}
          {row.assignStatus == AssignStatus.UNASSIGNED && 
            <Popup 
            trigger={
              <IconButton size='small' sx={{ mr: 0.5, color:'#51AB3B'}}>    
                <PlusCircleOutline/>
              </IconButton>
            }
            position="left center">
              <OutlinedInput
                variant={'standard'}
                size='small'
                placeholder='Route Id'
                sx={{ maxWidth: '180px' }}
                onKeyDown={e => handleRouteAssignment(e, row.id)}
              />
              
            </Popup>
          }
          {row.assignStatus == AssignStatus.ASSIGNED && <Check/>}
          <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }}>
            <DotsVertical/>
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DriversTableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter}/>
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
            onSelectionModelChange={rows => setSelectedRows(rows)}
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
          {messageInfo != '' ? messageInfo : 'Success'}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default DriversList
