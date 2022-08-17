// ** MUI Import
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = () => {

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <img src='/images/favicon.png' width={100} height={100} alt='logo'></img>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
