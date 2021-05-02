import makePostShipments from "./post-shipments"
import makeGetShipmentsById from './get-shipments-id'
import makePatchShipmentsById from './patch-shipments-id'
import makePatchShipmentsPositionById from "./patch-shipments-id-position"

export default function makeControllers(entities) {
    return Object.freeze({
        postShipments: makePostShipments(entities),
        getShipmentsById: makeGetShipmentsById(entities), 
        patchShipmentsById: makePatchShipmentsById(entities), 
        patchShipmentsPositionById: makePatchShipmentsPositionById(entities)
    })
}