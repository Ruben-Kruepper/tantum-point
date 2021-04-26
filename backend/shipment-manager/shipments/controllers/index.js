import makePostShipments from "./post-shipments";
import makeGetShipmentsById from './get-shipments-id'

export default function makeControllers(entities) {
    return Object.freeze({
        postShipments: makePostShipments(entities),
        getShipmentsById: makeGetShipmentsById(entities)
    })
}