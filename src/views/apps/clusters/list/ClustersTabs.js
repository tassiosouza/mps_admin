import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Plus from 'mdi-material-ui/Plus'
import Minus from 'mdi-material-ui/Minus'

// ** Custom Components Imports
import ClustersHeader from 'src/views/apps/clusters/list/ClustersHeader'

// ** Store & Actions Imports
import { setSubscriptionsAssignment } from 'src/store/apps/clusters'

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

const ClustersTabs = props => {
  const { store, dispatch } = props

  // ** State
  const [value, setValue] = useState('0')
  const [filter, setFilter] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setFilter('')
  }

  const getAttachedSubscriptions = () => {
    return store.subscriptions.filter(
      sub =>
        sub.clusterId === store.selectedClusters[0].id &&
        (sub.name.toLowerCase().includes(filter.toLocaleLowerCase()) ||
          sub.number.toLowerCase().includes(filter.toLocaleLowerCase()))
    )
  }

  const getDetachedSubscriptions = () => {
    return store.subscriptions.filter(
      sub =>
        sub.clusterId === '' &&
        (sub.name.toLowerCase().includes(filter.toLocaleLowerCase()) ||
          sub.number.toLowerCase().includes(filter.toLocaleLowerCase()))
    )
  }

  const handleAssignment = subscriptions => {
    // ** If subscription is assigned = unassign
    // ** If subscription is unassigned = assign
    dispatch(setSubscriptionsAssignment({ subscriptionsToUpdate: subscriptions, cluster: store.selectedClusters[0] }))
  }

  const handleFilter = value => {
    setFilter(value)
  }

  const defaultColumns = [
    {
      flex: 0.3,
      field: 'number',
      minWidth: 80,
      headerName: 'ID',
      renderCell: ({ row }) => <StyledLink onClick={() => {}}>{row.number}</StyledLink>
    },
    {
      flex: 1,
      minWidth: 100,
      field: 'name',
      headerName: 'Client',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>{row.name}</Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Action',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={row.clusterId != '' ? 'Detach' : 'Attach'}>
            <IconButton
              disabled={!store.selectedClusters[0].editing}
              size='small'
              sx={{ mr: 0.5 }}
              onClick={() => {
                handleAssignment([row])
              }}
            >
              {row.clusterId != '' ? <Minus /> : <Plus />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='0' label='Info' />
        <Tab value='1' label='Attacheds' />
        <Tab value='2' label='Detacheds' />
      </TabList>
      <TabPanel value='0'>
        <Card>
          <Typography sx={{ fontWeight: 'bold' }} variant='h7'>
            Parameters
          </Typography>
        </Card>
      </TabPanel>
      <TabPanel value='1'>
        <Card>
          <ClustersHeader selectedRows={store.selectedDetachedSubscriptions} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            pagination
            rows={getAttachedSubscriptions()}
            columns={defaultColumns}
            disableSelectionOnClick
            pageSize={8}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </TabPanel>
      <TabPanel value='2'>
        <Card>
          <ClustersHeader selectedRows={store.selectedAttachedSubscriptions} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            pagination
            rows={getDetachedSubscriptions()}
            columns={defaultColumns}
            disableSelectionOnClick
            pageSize={8}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </TabPanel>
    </TabContext>
  )
}

export default ClustersTabs
