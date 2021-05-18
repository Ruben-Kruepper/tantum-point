import React, { useEffect } from 'react'
import axios from 'axios'
import { LoadingFiller } from '../components/LoadingFiller'

const AuthContext = React.createContext()

function AuthProvider(props) {
    let [user, setUser] = React.useState(null)
    let [token, setToken] = React.useState('')
    let [isTransition, setIsTransition] = React.useState(false)
    
    useEffect(() => {
        setIsTransition(true)
        const user_ = JSON.parse(localStorage.getItem('user'))
        const token_ = localStorage.getItem('token')
        if (token_ && user_) {
            setUser(user_)
            setToken(token_)
        }
        setIsTransition(false)
    }, [])
    
    if (isTransition) {
        return (<LoadingFiller height={window.innerHeight} />)
    }

    const login = async (username, password) => {
        setIsTransition(true)
        await axios.post(
            `${process.env.REACT_APP_SHIPMENT_MANAGER_HOST}/users/login`,
            { loginData: { username, password } },
            { headers: { accepts: 'application/json' } })
        const response = await axios.post(`${process.env.REACT_APP_SHIPMENT_MANAGER_HOST}/users/login`, { loginData: { username, password } })
        if (response.status === 200) {
            setUser(response.data.decoded)
            setToken(response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.decoded))
            localStorage.setItem('token', response.data.token)
        }
        setIsTransition(false)
    }
    const register = async (username, password) => {
        setIsTransition(true)
        const { data, status } = await axios.post(
            `${process.env.REACT_APP_SHIPMENT_MANAGER_HOST}/users/register`,
            {
                registrationData: {
                    username,
                    password
                }
            }
        )
        if (status === 200) {
            setUser(data.decoded)
            setToken(data.token)
            localStorage.setItem('user', JSON.stringify(data.decoded))
            localStorage.setItem('token', data.token)
            setIsTransition(false)
        }
        setIsTransition(false)
    }
    const logout = () => {
        setIsTransition(true)
        setUser(null)
        setToken('')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsTransition(false)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }} {...props} />
    )
}

const useAuthContext = () => React.useContext(AuthContext)

export default useAuthContext
export { AuthProvider, useAuthContext }
