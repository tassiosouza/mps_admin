// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { DialogTitle, Dialog, DialogContent, DialogActions, TextField } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchClusters, clearTempResults, generateRoutes, saveRoutes } from 'src/store/apps/routes'
import { Player } from '@lottiefiles/react-lottie-player'

// ** Icons Imports
import MapMarkerRadius from 'mdi-material-ui/MapMarkerRadius'
import ClockTimeEightOutline from 'mdi-material-ui/ClockTimeEightOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import TimelinePlus from 'mdi-material-ui/TimelinePlus'
import TimelineMinus from 'mdi-material-ui/TimelineMinus'

// ** Custom Components Imports
import LocationsTableHeader from './LocationsTableHeader'
import { isEmpty } from '@aws-amplify/core'
import Countdown from 'react-countdown'

const Status = {
  INITIAL: 'initial',
  LOADING: 'loading',
  DONE: 'done',
  SAVING: 'saving'
}

const ALGORITHM_TYPE = {
  OPTIMIZATION: 'Optimization',
  CLUSTERING: 'Clustering'
}

const LocationsDialog = props => {
  // ** Props
  const { open, onClose } = props

  // ** States
  const [value, setValue] = useState('')
  const [status, setStatus] = useState(Status.INITIAL)
  const [error, setError] = useState('')
  const [selectedClusters, setSelectedClusters] = useState([])

  // ** Param States
  const [paramMinBags, setParamMinBags] = useState('')
  const [paramMaxBags, setParamMaxBags] = useState('')
  const [paramIsDefault, setParamIsDefault] = useState(true)

  // ** Redux
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)

  useEffect(() => {
    dispatch(fetchClusters({ q: value }))
  }, [dispatch, value])

  // ** Functions
  const handleFilter = val => {
    setValue(val)
  }

  const handleGenerate = () => {
    console.log('selecteds: ' + JSON.stringify(selectedClusters))

    // ** Form Validation
    if (!paramIsDefault) {
      if (isNaN(paramMinBags) || isEmpty(paramMinBags) || isNaN(paramMaxBags) || isEmpty(paramMaxBags)) {
        setError('Invalid parameters')
        return
      }
    }

    if (!selectedClusters.length) {
      setError('Select at least one cluster')
      return
    }

    setError('')
    setStatus(Status.LOADING)
    dispatch(
      generateRoutes({
        parameters: {
          paramMinBags: parseInt(paramMinBags),
          paramMaxBags: parseInt(paramMaxBags),
          paramIsDefault: paramIsDefault
        },
        subscriptions: store.subscriptions,
        clusters: selectedClusters,
        callback: optimizationCallback
      })
    )
  }

  const handleConfirm = () => {
    dispatch(saveRoutes({ callback: handleClose }))
    setStatus(Status.SAVING)
  }

  const handleRetry = () => {
    setError('')
    setValue('')
    setParamMaxBags('')
    setParamMinBags('')
    setSelectedClusters([])
    dispatch(clearTempResults())
    setStatus(Status.INITIAL)
  }

  const optimizationCallback = () => {
    setStatus(Status.DONE)
  }

  const handleClose = () => {
    onClose()
    setError('')
    setValue('')
    setParamMaxBags('')
    setParamMinBags('')
    setSelectedClusters([])
    setStatus(Status.INITIAL)
  }

  const getDeliveriesCount = () => {
    var result = 0
    store.clusters.map(cl => (result += cl.subscriptionsCount))
    return result
  }

  const isClusterRouted = cluster => {
    return store.routes.filter(r => r.clusterId === cluster.id).length
  }

  var resolutionAnimationPath = ''
  var backgroundImage = ''
  var textColor = ''
  if (store.solution) {
    switch (store.solution.result) {
      case 'success':
        backgroundImage = 'url(/images/dialogs/result-ok-bg.png)'
        resolutionAnimationPath = 'https://assets8.lottiefiles.com/datafiles/Wv6eeBslW1APprw/data.json'
        textColor = '#51AB3B'
        break
      case 'problem':
        backgroundImage = 'url(/images/dialogs/result-pro-bg.png)'
        resolutionAnimationPath = 'https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json'
        textColor = '#FF9800'
        break
      case 'error':
        backgroundImage = 'url(/images/dialogs/result-err-bg.png)'
        resolutionAnimationPath = 'https://assets2.lottiefiles.com/packages/lf20_qw8ewk7k.json'
        textColor = '#F21313'
        break
      default:
        backgroundImage = 'url(/images/dialogs/result-pro-bg.png)'
        resolutionAnimationPath = 'https://assets3.lottiefiles.com/private_files/lf30_nthn6ztz.json'
        textColor = '#FF9800'
        break
    }
  }

  const LoadingAndDone = () => {
    var expectedWaitTime = 0
    var totalDeliveries = 0
    selectedClusters.map(cl => {
      if (cl.subscriptionsCount > 150) {
        expectedWaitTime += 280000
      } else {
        expectedWaitTime += 3000 + cl.subscriptionsCount * 25
      }
      totalDeliveries += cl.subscriptionsCount
    })

    return status == Status.LOADING ? (
      <Grid container spacing={3} direction='column'>
        <Grid item xs={3}>
          <Typography component='div'>
            Generating optimized routes for
            <Box fontWeight='600' display='inline'>
              {' '}
              {selectedClusters.length} Clusters{' '}
            </Box>
            and
            <Box fontWeight='600' display='inline'>
              {' '}
              {totalDeliveries} totalDeliveries
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ mb: 8 }}>
          <Typography component='div'>
            Expected wait time:
            <Box fontWeight='600' display='inline'>
              {' '}
              <Countdown sx={{ ml: 10 }} date={Date.now() + expectedWaitTime} />
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ alignSelf: 'center' }}>
          {/* <img src='/animations/optimizing.gif' width={300} height={300} /> */}
          <Player
            loop
            autoplay
            keepLastFrame
            src={'https://assets4.lottiefiles.com/packages/lf20_EcWipt2nmD.json'}
            style={{ height: '320px', width: '320px' }}
          ></Player>
        </Grid>
      </Grid>
    ) : (
      <Grid container spacing={10} direction='column'>
        <Grid item sx={{ alignSelf: 'center', display: 'flex' }}>
          <Player
            autoplay
            keepLastFrame
            src={resolutionAnimationPath}
            style={{ height: '120px', width: '120px' }}
          ></Player>
        </Grid>
        <Grid item sx={{ alignSelf: 'center' }}>
          {store.solution.result === 'success' && (
            <Typography sx={{ fontSize: '25px', fontWeight: '600' }}>Routes generated with success.</Typography>
          )}
          {store.solution.result === 'problem' && (
            <Typography sx={{ fontSize: '25px', fontWeight: '600' }}>
              Wrong parameters used to generate the routes.
            </Typography>
          )}
          {store.solution.result === 'error' && (
            <Typography sx={{ fontSize: '25px', fontWeight: '600' }}>
              Could not generate routes. Please check the console.
            </Typography>
          )}
        </Grid>
        <Grid
          item
          sx={{
            alignSelf: 'center',
            display: 'flex',
            pr: '40px',
            pl: '90px !important',
            justifyContent: 'space-between',
            alignSelf: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <MapMarkerRadius sx={{ alignSelf: 'center' }}></MapMarkerRadius>
            {store.solution.result != 'error' && (
              <Typography sx={{ fontSize: '15px', textAlign: 'center' }}>Routes</Typography>
            )}
            <Typography sx={{ fontSize: '15px', textAlign: 'center', color: textColor }}>
              {store.tempRoutes.length}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <ClockTimeEightOutline sx={{ alignSelf: 'center' }}></ClockTimeEightOutline>
            <Typography sx={{ fontSize: '15px', textAlign: 'center' }}>Max Duration</Typography>
            <Typography sx={{ fontSize: '15px', textAlign: 'center', color: textColor }}>
              {secondsToHms(store.solution.maxDuration)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <TimelinePlus sx={{ alignSelf: 'center' }}></TimelinePlus>
            <Typography sx={{ fontSize: '15px', textAlign: 'center' }}>Max Route Bags</Typography>
            <Typography sx={{ fontSize: '15px', textAlign: 'center', color: textColor }}>
              {store.solution.maxBags}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <TimelineMinus sx={{ alignSelf: 'center' }}></TimelineMinus>
            <Typography sx={{ fontSize: '15px', textAlign: 'center' }}>Min Route Bags</Typography>
            <Typography sx={{ fontSize: '15px', textAlign: 'center', color: textColor }}>
              {store.solution.minBags}
            </Typography>
          </Box>
          {/* {store.solution.details.map((detail, index) => {
            return ( <Typography key={index} component='div'>{detail}</Typography>)
            })
          } */}
        </Grid>
      </Grid>
    )
  }

  function secondsToHms(d) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? 'h' : 'h') : ''
    var mDisplay = m > 0 ? m + (m == 1 ? 'm' : 'm') : ''
    return hDisplay + mDisplay
  }

  const defaultColumns = [
    {
      flex: 1.3,
      field: 'name',
      minWidth: 120,
      headerAlign: 'center',
      headerName: 'Name',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          <Typography sx={{ fontSize: '15px', textAlign: 'start' }}>{row.name}</Typography>
        </Box>
      )
    },
    {
      flex: 0.9,
      minWidth: 80,
      field: 'parameters',
      headerAlign: 'center',
      headerName: 'Params',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          Min: {row.minBags} {' | '} Max: {row.maxBags}
        </Box>
      )
    },
    {
      flex: 0.6,
      minWidth: 80,
      headerAlign: 'center',
      field: 'subscriptionsCount',
      headerName: 'Subscriptions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>{row.subscriptionsCount}</Box>
      )
    }
  ]

  const getSelectedAlgorithmParameters = () => {
    return (
      <Grid item>
        <Typography sx={{ fontWeight: 'bold' }} variant='h7'>
          Parameters
        </Typography>
        <Tooltip title='The routes will be generated respecting the limits for minimum and maximum amount of bags.'>
          <InformationOutline sx={{ fontSize: 14, ml: 1 }} />
        </Tooltip>
        <Box sx={{ display: 'flex', justifyContent: 'start', pt: 5 }}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                value={paramIsDefault}
                onChange={e => {
                  setParamIsDefault(e.target.checked)
                  setParamMinBags(e.target.checked ? '' : paramMinBags)
                  setParamMaxBags(e.target.checked ? '' : paramMaxBags)
                }}
              />
            }
            labelPlacement='bottom'
            label='Default'
          />
          <Divider orientation='vertical' variant='middle' flexItem />
          <TextField
            disabled={paramIsDefault}
            variant='standard'
            size='small'
            label='Min Bags'
            value={paramMinBags}
            onChange={e => {
              const re = /^[0-9\b]+$/
              if (e.target.value === '' || re.test(e.target.value) || e.target.value === '-') {
                setParamMinBags(e.target.value)
              }
            }}
            placeholder='Min Bags'
            sx={{ width: '25%', fontSize: '20px', alignSelf: 'center', mr: 5, ml: 5 }}
          />
          <Divider orientation='vertical' variant='middle' flexItem />
          <TextField
            disabled={paramIsDefault}
            variant='standard'
            size='small'
            label='Max Bags'
            value={paramMaxBags}
            onChange={e => {
              const re = /^[0-9\b]+$/
              if (e.target.value === '' || re.test(e.target.value) || e.target.value === '-') {
                setParamMaxBags(e.target.value)
              }
            }}
            placeholder='Max Bags'
            sx={{ width: '25%', fontSize: '20px', alignSelf: 'center', ml: 5 }}
          />
        </Box>
      </Grid>
    )
  }

  return (
    <Dialog
      open={open}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      PaperProps={{
        style: {
          width: '50%',
          maxWidth: 'none'
        }
      }}
    >
      {(status == Status.LOADING || status == Status.SAVING) && <LinearProgress sx={{ height: '2px', mt: 0.2 }} />}
      <DialogTitle id='scroll-dialog-title'>Generate Routes</DialogTitle>
      <DialogContent
        dividers={scroll === 'paper'}
        style={{
          backgroundImage: status == Status.DONE || status == Status.SAVING ? backgroundImage : 'none',
          backgroundSize: status == Status.DONE || status == Status.SAVING ? 'cover' : 'none',
          width: '100%',
          height: status == Status.DONE || status == Status.SAVING ? '63vH' : '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {status === Status.INITIAL ? (
          <div>
            <Grid container direction={'column'} spacing={3} sx={{ alignContent: 'start' }}>
              {getSelectedAlgorithmParameters()}
              <Grid item sx={{ width: '100%' }}>
                <LocationsTableHeader
                  handleFilter={handleFilter}
                  selectedClusters={selectedClusters}
                ></LocationsTableHeader>
                <Box
                  sx={{
                    height: '260px',
                    ['@media (min-width:1900px)']: {
                      // eslint-disable-line no-useless-computed-key
                      height: '475px'
                    }
                  }}
                >
                  <DataGrid
                    hideFooter
                    selectionModel={selectedClusters.map(route => route.id)}
                    onSelectionModelChange={ids => {
                      const selectedIDs = new Set(ids)
                      const selectedRowData = store.clusters.filter(cl => selectedIDs.has(cl.id.toString()))
                      setSelectedClusters(selectedRowData)
                    }}
                    pagination
                    checkboxSelection
                    isRowSelectable={params => !isClusterRouted(params.row)}
                    disableSelectionOnClick
                    rows={store.clusters}
                    columns={defaultColumns}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        ) : (
          <LoadingAndDone />
        )}
        <Grid sx={{ justifyContent: 'end' }} direction='row' spacing={0}>
          <DialogActions sx={{ pb: 0 }}>
            <Typography sx={{ color: 'error.main' }} variant='h7'>
              {error}
            </Typography>
            {status != Status.SAVING && (
              <Button onClick={handleClose} sx={{ ml: 3, color: status == Status.DONE ? '#fff' : 'primary' }}>
                {' '}
                Cancel
              </Button>
            )}
            {status === Status.DONE && (
              <Button onClick={handleRetry} sx={{ color: status == Status.DONE ? '#fff' : 'primary' }}>
                {' '}
                Retry{' '}
              </Button>
            )}
            {status === Status.INITIAL && (
              <Button onClick={handleGenerate} sx={{ color: status == Status.DONE ? '#fff' : 'primary' }}>
                {' '}
                Generate{' '}
              </Button>
            )}
            {status === Status.DONE && store.solution.result == 'success' && (
              <Button onClick={handleConfirm} sx={{ color: status == Status.DONE ? '#fff' : 'primary' }}>
                {' '}
                Confirm{' '}
              </Button>
            )}
            {status === Status.SAVING && (
              <Button disabled onClick={handleConfirm} sx={{ color: status == Status.DONE ? '#fff' : 'primary' }}>
                {' '}
                Saving...{' '}
              </Button>
            )}
          </DialogActions>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default LocationsDialog
