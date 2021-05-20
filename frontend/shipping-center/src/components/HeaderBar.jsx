import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    makeStyles,
    ButtonGroup,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core'

import { Link } from 'react-router-dom'

import { Menu } from '@material-ui/icons'
import useAuthContext from '../context/AuthContext'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(6)
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        paddingRight: theme.spacing(4)
    },
    links: {
        display: 'flex',
    },
    link: {
        whiteSpace: 'nowrap'
    },
    buttonGroupEnd: {
        flexGrow: 1,
        justifyContent: 'flex-end'
    }
}))


export function HeaderBar(props) {
    const classes = useStyles(props)
    const { user, logout } = useAuthContext()
    return (
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
                        <Menu />
                    </IconButton>
                    <Typography variant='h6' className={classes.title}>
                        Tantum Point Tracking
                    </Typography>
                    <List className={classes.links} color='inherit'>
                        <ListItem button className={classes.link} color='inherit' component={Link} to='/'>
                            <ListItemText color='inherit'>Home</ListItemText>
                        </ListItem>
                        <ListItem button className={classes.link} color='inherit' component={Link} to='/my/shipments-overview'>
                            <ListItemText color='inherit'>My Shipments</ListItemText>
                        </ListItem>
                    </List>
                    <ButtonGroup className={classes.buttonGroupEnd}>
                        {user ? (
                            <Button color='secondary' variant='text' onClick={logout}>Logout</Button>
                        ) : ([
                            <Button key='login' color='secondary' variant='text' component={Link} to='/login'>Login</Button>,
                            <Button key='register' color='secondary' variant='text' component={Link} to='/register'>Register</Button>
                        ])}
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
        </div>
    )
}