import { useState, useEffect } from 'react'
import {
    makeStyles,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    useTheme,
    Tabs,
    Tab,
    Toolbar,
    Grid,
    Box,
    TextField,
    Button
} from '@material-ui/core'
import {
    ExpandMore,
    ExpandLess,
    FiberManualRecord,
    AccountCircle
} from '@material-ui/icons'

import useShipmentManagerContext from '../context/ShipmentManagerContext'
import { LoadingFiller } from '../components/LoadingFiller'
import { Map } from '../components/Map'


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: theme.breakpoints.values.lg,
        margin: 'auto'
    },
    map: {
        width: '100%',
        maxWidth: theme.breakpoints.values.lg,
        height: 250,
        margin: 'auto'
    }
}))


export default function ShipmentsOverviewPage() {
    const theme = useTheme()
    const classes = useStyles()
    const apiMethods = useShipmentManagerContext()

    const [shipments, setShipments] = useState([])
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        const fetchShipments = async () => {
            setShipments(await apiMethods.getShipments())
        }
        fetchShipments()
    }, [apiMethods])

    if (!shipments) { return <div className={classes.root}><LoadingFiller /></div> }

    return (<>
        <Map
            className={classes.map}
            route={shipments[expanded] ? shipments[expanded].route.points.map(({ lat, lon }) => [lon, lat]) : null} 
            position={shipments[expanded] ? [shipments[expanded].route.position.lon, shipments[expanded].route.position.lat] : null}/>
        <TableContainer className={classes.root}>
            <Table aria-label='shipments table'>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Reference</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>ETA</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shipments.map((shipment, index) => (
                        <ShipmentRow
                            background={index % 2 ? theme.palette.grey[200] : theme.palette.grey[100]}
                            shipment={shipment}
                            key={shipment._id}
                            expandSignal={() => setExpanded(index)}
                            collapseSignal={() => setExpanded(null)}
                            isExpanded={expanded === index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>)
}

const useRowStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    }
}))

function ShipmentRow(props) {
    const theme = useTheme()
    const { shipment, expandSignal, collapseSignal, isExpanded } = props
    const background = props.background || theme.palette.grey[200]
    const classes = useRowStyles()

    return (<>
        <TableRow className={classes.root} style={{ background }}>
            <TableCell>
                <IconButton
                    aria-label='expand row'
                    size='small'
                    onClick={() => { isExpanded ? collapseSignal() : expandSignal() }}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </TableCell>
            <TableCell component='th' scope='row'>
                {shipment.sender.references.Auftragsnr}
            </TableCell>
            <TableCell>{shipment.sender.references.Kunde}</TableCell>
            <TableCell>{shipment.route.destination.address}</TableCell>
            <TableCell>{formattedDate(shipment.route.eta.value)}</TableCell>
            <TableCell>
                <FiberManualRecord style={{
                    fill: new Date(shipment.route.eta.value) < new Date(shipment.route.eta.targetDeliveryDate) ?
                        theme.palette.success.main : theme.palette.warning.main
                }} />
            </TableCell>
        </TableRow>
        <TableRow style={{ background }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <DetailTabs shipment={shipment} />
                </Collapse>
            </TableCell>
        </TableRow>
    </>)
}

const useDetailTabStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    }
}))

function DetailTabs(props) {
    const { shipment } = props
    const classes = useDetailTabStyles()
    const [selected, setSelected] = useState(0)

    const handleSwitch = (event, newValue) => {
        setSelected(newValue)
    }

    return (
        <div className={classes.root}>
            <Toolbar >
                <Tabs value={selected} onChange={handleSwitch} aria-label='switch detail view'>
                    <Tab label='references' id='references-tab' aria-controls='tabpanel-references' />
                    <Tab label='route' id='route-tab' aria-controls='tabpanel-route' />
                    <Tab label='subscribers' id='subscribers-tab' aria-controls='tabpanel-subscribers' />
                </Tabs>
            </Toolbar>
            <Box display={selected === 0 ? 'initial' : 'none'}>
                <ReferenceDetails shipment={shipment} />
            </Box>
            <Box display={selected === 1 ? 'initial' : 'none'}>
                <RouteDetails shipment={shipment} />
            </Box>
            <Box display={selected === 2 ? 'initial' : 'none'}>
                <SubscriberDetails shipment={shipment} />
            </Box>
        </div>
    )
}

function ReferenceDetails(props) {
    const { shipment } = props
    const referenceKeys = Object.keys(shipment.sender.references)
    const referenceValues = referenceKeys.map(key => shipment.sender.references[key])
    const conditionKeys = Object.keys(shipment.sender.conditions)
    const conditionValues = conditionKeys.map(key => shipment.sender.conditions[key])

    return (
        <Grid container spacing={1}>
            <KeyValueGrid keys={referenceKeys} values={referenceValues} lg={3} xs={6} />
            <KeyValueGrid keys={conditionKeys} values={conditionValues} lg={3} xs={6} />
        </Grid>
    )

}

function RouteDetails(props) {
    const { shipment } = props
    return (
        <Grid container spacing={1}>
            <KeyValueGrid
                keys={['Target delivery date', 'Current estimate']}
                values={[formattedDate(shipment.route.eta.targetDeliveryDate), formattedDate(shipment.route.eta.value)]}
                lg={3} xs={6} />
            { shipment.route.delay ? 
                <KeyValueGrid
                    title='Non-traffic delay'
                    keys={['Delayed until', 'Driver note']}
                    values={[formattedDate(shipment.route.delay.until), shipment.route.delay.reason || '-']}
                    lg={3} xs={6} />
                : <KeyValueGrid
                    keys={['No non-traffic delays']}
                    values={['']}
                    lg={3} xs={6} />
            }
        </Grid>
    )
}

function SubscriberDetails(props) {
    const { shipment } = props

    const [subscriber, setSubscriber] = useState('')
    const [isValidSubscriber, setIsValidSubscriber] = useState(true)
    const [subscribers, setSubscribers] = useState(shipment.sender.subscribers)

    const checkSubscriber = () => {
        setIsValidSubscriber(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(subscriber))
    }

    const addSubscriberCallback = () => {
        checkSubscriber()
        if (isValidSubscriber) {
            setSubscribers([...subscribers, subscriber])
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item container spacing={1} alignItems='flex-end'>
                <Grid item>
                    <AccountCircle />
                </Grid>
                <Grid item>
                    <TextField
                        id='input-with-icon-grid'
                        label='Subscriber email'
                        style={{ minWidth: 250 }}
                        type='email'
                        color='secondary'
                        onChange={(event) => { setSubscriber(event.target.value) }}
                        error={!isValidSubscriber} />
                </Grid>
                <Grid item>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={addSubscriberCallback} >
                        Add
                    </Button>
                </Grid>
            </Grid>
            <KeyValueGrid keys={['Subscribers']} values={subscribers} />
        </Grid>
    )
}

function KeyValueGrid(props) {
    const { title, keys, values, ...other } = props
    return (<>
        <Grid item {...other}>
            {title && <Box fontWeight='bold' key={title}>{title}</Box>}
            {keys.map(value => <Box fontWeight='bold' key={value}>{value}</Box>)}
        </Grid>
        <Grid item {...other}>
            {title && <Box visibility='hidden' key='_spaceTitle'>{title}</Box>}
            {values.map(value => <Box key={value}>{value}</Box>)}
        </Grid>
    </>)
}

function formattedDate(rep) {
    try {
        const dt = new Date(rep)
        return dt.toLocaleDateString()
    } catch {
        return 'NA'
    }
}
