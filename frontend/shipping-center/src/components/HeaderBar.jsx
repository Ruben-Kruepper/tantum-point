import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    makeStyles,
    ButtonGroup
} from '@material-ui/core'

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
        flexGrow: 1,
    },
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
                    <ButtonGroup>
                        { user ? (
                            <Button color='secondary' variant='text' onClick={logout}>Logout</Button>
                            ) : ([
                                <Button key='login' color='secondary' variant='text' href='/login'>Login</Button>,
                                <Button key='register' color='secondary' variant='text' href='/register'>Register</Button>
                            ])
                        }
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
        </div>
    )
}