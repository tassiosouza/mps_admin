// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import LocationsDialog from 'src/views/apps/routes/list/LocationsDialog'
import DriversTableHeader from 'src/views/apps/routes/list/DriversTableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

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
    flex: 0.25,
    field: 'driver',
    minWidth: 300,
    headerName: 'Name',
    renderCell: ({ row }) => {<Typography variant='body2'>{row.phone}</Typography>}
  }
]

/* eslint-enable */
const DriversList = () => {
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [statusValue, setStatusValue] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [openDialog, setOpenDialog] = useState(false)

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)

  useEffect(() => {

  }, [dispatch, statusValue, value])

  const handleFilter = val => {
    setValue(val)
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
            <Link href={`/apps/route/preview/${row.id}`} passHref>
              <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }}>
                <DeleteOutline />
              </IconButton>
            </Link>
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
          <DriversTableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} openDialog={handleOpenDialog} />
          {store.loading && <LinearProgress sx={{ height:'2px' }} />}
          <DataGrid
            autoHeight
            pagination
            rows={store.data}
            columns={columns}
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

export default DriversList
