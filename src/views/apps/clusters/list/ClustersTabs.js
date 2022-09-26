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

// ** Custom Components Imports
import ClustersHeader from 'src/views/apps/clusters/list/ClustersHeader'


const ClustersTabs = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
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
            rows={[]}
            columns={['Name', 'Count', 'Actions']}
            checkboxSelection
            disableSelectionOnClick
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
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
              rows={[]}
              columns={['Name', 'Count', 'Actions']}
              checkboxSelection
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
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