import React from 'react'
import axios from 'axios'

import useAuthContext from './AuthContext'

const ShipmentManagerContext = React.createContext()

function ShipmentManagerProvider(props) {
    let { user, token } = useAuthContext()

    const getShipments = React.useCallback(async () => {
        return axios.get(
            `${process.env.REACT_APP_SHIPMENT_MANAGER_HOST}/shipments/${user.organization}`,
            {
                headers: {
                    foo: 'bar',
                    authorization: token
                }
            }
        )
            .then(response => response.data.shipments)
            .catch(error => {
                if (error.response) { console.error(error.response) }
                return []
            })
    }, [user, token])

    const apiMethods = {
        getShipments
    }

    return (
        <ShipmentManagerContext.Provider value={apiMethods} {...props} />
    )
}

const useShipmentManagerContext = () => React.useContext(ShipmentManagerContext)

export default useShipmentManagerContext
export { ShipmentManagerProvider, useShipmentManagerContext }