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

// ** Icons Imports
import Check from 'mdi-material-ui/Check'
import Download from 'mdi-material-ui/Download'
import Cancel from 'mdi-material-ui/Cancel'
import ContentCopy from 'mdi-material-ui/ContentCopy'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import Plus from 'mdi-material-ui/Plus'
import Minus from 'mdi-material-ui/Minus'
import ImageOutline from 'mdi-material-ui/ImageOutline'

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

const ClustersTabs = (props) => {

  const { store, dispatch } = props

  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const getAttachedSubscriptions = () => {
    return store.subscriptions.filter(sub => sub.clusterId === store.selectedClusters[0].id)
  }

  const getDetachedSubscriptions = () => {
    return store.subscriptions.filter(sub => sub.clusterId === '')
  }

  const handleAssignment = subscriptions => {
    // ** If subscription is assigned = unassign
    // ** If subscription is unassigned = assign
    dispatch(setSubscriptionsAssignment({subscriptionsToUpdate: subscriptions, cluster: store.selectedClusters[0]}))
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
      field:'name',
      headerName: 'Client',
      renderCell: ({ row }) => 
      <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        {row.name}
      </Box>
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
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => {handleAssignment([row])}}>
              {row.clusterId != '' ? <Minus/> : <Plus/>}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='1' label='Attacheds' />
        <Tab value='2' label='Detacheds' />
      </TabList>
      <TabPanel value='1'>
        <Card>
          <ClustersHeader value={''} selectedRows={[]} handleFilter={() => {}} refresh={() => {}} />
          {/* {true && <LinearProgress sx={{ height:'2px' }} />} */}
          <DataGrid
            autoHeight
            pagination
            rows={getAttachedSubscriptions()}
            columns={defaultColumns}
            checkboxSelection
            disableSelectionOnClick
            pageSize={8}
            sx={{'& .MuiDataGrid-columnHeaders': { borderRadius: 0 }}}
            onSelectionModelChange={rows => {}}
            onPageSizeChange={newPageSize => {}}
          />
        </Card>
      </TabPanel>
      <TabPanel value='2'>
        <Card>
            <ClustersHeader value={''} selectedRows={[]} handleFilter={() => {}} refresh={() => {}} />
            {/* {true && <LinearProgress sx={{ height:'2px' }} />} */}
            <DataGrid
              autoHeight
              pagination
              rows={getDetachedSubscriptions()}
              columns={defaultColumns}
              checkboxSelection
              disableSelectionOnClick
              pageSize={8}
              sx={{'& .MuiDataGrid-columnHeaders': { borderRadius: 0 }}}
              onSelectionModelChange={rows => {}}
              onPageSizeChange={newPageSize => {}}
            />
          </Card>
      </TabPanel>
    </TabContext>
  )
}

export default ClustersTabs