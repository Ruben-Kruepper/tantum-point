import React from 'react'
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { HeaderBar } from './components/HeaderBar'
import { useAuthContext } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ShipmentsOverviewPage from './pages/ShipmentsOverviewPage'
import NotFoundPage from './pages/NotFoundPage'


export default function AppRoutes() {
    const { user } = useAuthContext()

    return (
        <BrowserRouter>
            <HeaderBar />
            <Switch>
                {/* public access */}
                <Route exact path='/'>
                    <LandingPage />
                </Route>
                <Route exact path='/login'>
                    <LoginPage />
                </Route>
                {/* authenticated users only */}
                <Route path='/my'>
                    {user ?
                        <AuthenticatedAppRoutes /> :
                        <Redirect to='/login'></Redirect>
                    }
                </Route>
                <NotFoundPage />
            </Switch>
        </BrowserRouter >
    )
}

function AuthenticatedAppRoutes() {
    return (
        <Route path='/my/shipments-overview'>
            <ShipmentsOverviewPage />
        </Route>
    )
}