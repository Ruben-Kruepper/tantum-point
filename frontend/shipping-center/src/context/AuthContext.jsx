import React from 'react'

const AuthContext = React.createContext()

function AuthProvider(props) {
    let [user, setUser] = React.useState(null)

    const login = (user, password) => {
        setUser ({
            user
        })
        localStorage.setItem('token', 'foo')
    }
    const register = () => { }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }} {...props} />
    )
}

const useAuthContext = () => React.useContext(AuthContext)

export default useAuthContext
export { AuthProvider, useAuthContext }
