import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

// ** Custom Components Imports
import ClustersHeader from 'src/views/apps/clusters/list/ClustersHeader'

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

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
  }
]

const ClustersTabs = (props) => {

  const { store } = props

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