// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/system';

// * Icons
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import CloseCircleOutline from 'mdi-material-ui/CloseCircleOutline'

const columns = [
  { id: 'location', label: 'Location', align:'start' },
  { id: 'deliveries', label: 'Deliveries', align:'center' },
  { id: 'action', label: 'Action', align:'right' }
]

const SmallTableCell = styled(TableCell)({
  padding: '5px 20px 5px 20px !important',
})


const LocationsTable = (props) => {
  // ** Props
  const { locations, selectedLocations, addLocation, removeLocation } = props
 
  // ** Functions
  const handleCheckLocation = (location) => {
    if(selectedLocations.filter(loc => loc.name === location.name).length > 0) {
      removeLocation(location)
    }
    else {
      addLocation(location)
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 330 }} >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <SmallTableCell key={column.id} align={column.align}>
                  {column.label}
                </SmallTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location, index) => {
              return (
                <TableRow hover tabIndex={-1} key={index}>
                  {columns.map((column, index) => {
                    return column.id != 'action' ? (
                      <SmallTableCell key={index} align={column.align}>
                        {column.id === 'location' ? location.name : location.deliveries}
                      </SmallTableCell>
                    ) : (
                      <SmallTableCell key={index} align='right'>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          
                          <Tooltip title='Add Location'>
                            {/* <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleAddLocations(location)}>
                              <PlusCircleOutline />
                            </IconButton> */}
                            <Checkbox
                              onChange={() => handleCheckLocation(location)}
                              checked={location.included}>
                            </Checkbox>
                          </Tooltip>
                        </Box>
                      </SmallTableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default LocationsTable
