import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    makeStyles,
    TextField,
    Grid
} from '@material-ui/core'
import {
    AccountCircle,
    ArrowForward,
    VpnKey
} from '@material-ui/icons'

import useAuthContext from '../context/AuthContext'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        marginTop: theme.spacing(6),
        maxWidth: 400,
        padding: theme.spacing(4),
        // justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
    },
    textInput: {
        minWidth: 250
    }
}))

export default function Login() {
    const classes = useStyles()
    const { user, login } = useAuthContext()
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isValidUsername, setIsValidUsername] = useState(true)
    
    if (user) { return <Redirect to='/my/shipments-overview' /> }
    
    const checkUsername = () => {
        setIsValidUsername(username && /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(username))
    }
    
    const userNameChangeCallback = (event) => {
        setUsername(event.target.value)
    }

    const passwordChangeCallback = (event) => {
        setPassword(event.target.value)
    }
    
    const loginUser = () => {
        login(username, password)
    }
    
    return (
        <Card className={classes.root} variant='elevation'>
            <CardContent>
                <Typography variant='h5' className={classes.title} gutterBottom>
                    Login
                </Typography>
                <Grid container>
                    <Grid item container spacing={1} alignItems='flex-end'>
                        <Grid item>
                            <AccountCircle />
                        </Grid>
                        <Grid item>
                            <TextField
                                id='input-with-icon-grid'
                                label='Account email'
                                className={classes.textInput}
                                type='email'
                                color='secondary'
                                autoFocus
                                onChange={userNameChangeCallback}
                                onBlur={checkUsername}
                                error={!isValidUsername}
                                required />
                        </Grid>
                    </Grid>
                    <Grid item container spacing={1} alignItems='flex-end'>
                        <Grid item>
                            <VpnKey />
                        </Grid>
                        <Grid item>
                            <TextField 
                                id='input-with-icon-grid'
                                label='Password'
                                className={classes.textInput}
                                type='password'
                                color='secondary'
                                onChange={passwordChangeCallback}
                                required />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button 
                    variant='contained' 
                    color='secondary'
                    onClick={loginUser}
                    endIcon={<ArrowForward />}>Login</Button>
            </CardActions>
        </Card>
    )
}
