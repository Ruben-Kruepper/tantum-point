import makePostShipments from "./post-shipments";
import makeGetShipmentsById from './get-shipments-id'

export default function makeControllers(shipments) {
    return Object.freeze({
        postShipments: makePostShipments(shipments),
        getShipmentsById: makeGetShipmentsById(shipments)
    })
}