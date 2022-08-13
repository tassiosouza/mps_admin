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

// * Icons
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import CloseCircleOutline from 'mdi-material-ui/CloseCircleOutline'

const columns = [
  { id: 'location', label: 'Location', minWidth: 70 },
  { id: 'deliveries', label: 'Deliveries', minWidth: 20 },
  { id: 'action', label: 'Action', minWidth: 10, align:'right'}
]
function createData(name, code, population, size) {
  const density = population / size

  return { location:name, deliveries:population, }
}

const LocationsTable = (props) => {

  // ** Props
  const { locations, addLocation, removeLocation } = props
 
  // ** Functions
  const handleAddLocations = (location) => {
    addLocation(location)
  }

  const handleRemoveLocations = (location) => {
    removeLocation(location)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 350 }} >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map(location => {
              return (
                <TableRow hover tabIndex={-1} key={location.code}>
                  {columns.map(column => {
                    return column.id != 'action' ? (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'location' ? location.name : location.deliveries}
                      </TableCell>
                    ) : (
                      <TableCell key={column.id} align='right'>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          <Tooltip title='Add Location'>
                            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleAddLocations(location)}>
                              <PlusCircleOutline />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title='Remove Location'>
                            <Box>
                              <IconButton size='small' onClick={() => {}}>
                                <CloseCircleOutline />
                              </IconButton>
                            </Box>
                          </Tooltip> */}
                        </Box>
                      </TableCell>
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
