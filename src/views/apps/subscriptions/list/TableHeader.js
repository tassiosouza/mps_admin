// ** Next Import
import Link from 'next/link'

// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { loadData } from 'src/store/apps/subscriptions'

// ** Icons Import
import Reload from 'mdi-material-ui/Reload'

const TableHeader = props => {
  // ** Props
  const { value, selectedRows, handleFilter } = props

  // ** Variables
  const allowedExtensions = ["csv"];

  // ** States
  const [error, setError] = useState('')

  // ** Refs
  const hiddenFileInput = useRef(null);

  // ** Hooks
  const dispatch = useDispatch()

  const handleFileUpload = (e) => {
    setError('');
    if (e.target.files.length) {
        const inputFile = e.target.files[0];

        const fileExtension = inputFile?.type.split("/")[1];
        if (!allowedExtensions.includes(fileExtension)) {
            setError('Please, enter a valid csv file');
            return;
        }
        dispatch(
          loadData({file: inputFile})
        )
    }
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Select
        size='small'
        displayEmpty
        defaultValue=''
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRows && selectedRows.length === 0}
        renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
      >
        <MenuItem value='' disabled>
          Actions
        </MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Send'>Send</MenuItem>
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 2 , width: '30%', justifyContent:'end'}}>
        <Typography variant='subtitle2' sx={{ color: false ? 'success.main' : 'error.main', mr: 2 }}>
                {error}
        </Typography>
        <Tooltip placement='top' title='Refresh Subscriptions'>
          <IconButton size='small' onClick={handleClick}>
            <Reload sx={{fontSize: '1.375rem'}}/>
            <input
                onChange={handleFileUpload}
                id="csvInput"
                name="file"
                type="File"
                ref={hiddenFileInput}
                style={{display: 'none'}}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search Subscription'
          sx={{ mr: 4, mb: 2, maxWidth: '180px'}}
          onChange={e => handleFilter(e.target.value)}
        />

        <Link href='/apps/invoice/add' passHref>
          <Button sx={{ mb: 2}} variant='contained'>
            Create Subscription
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default TableHeader
