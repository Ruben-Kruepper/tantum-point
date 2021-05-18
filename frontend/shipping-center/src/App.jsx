import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { cyan, blueGrey } from '@material-ui/core/colors'

import AppRoutes from './AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { ShipmentManagerProvider } from './context/ShipmentManagerContext'


const theme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey[900]
        },
        secondary: {
            main: cyan[400]
        }
    }
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <ShipmentManagerProvider>
                    <AppRoutes />
                </ShipmentManagerProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App