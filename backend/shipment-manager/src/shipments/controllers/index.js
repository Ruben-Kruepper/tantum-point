import makePostShipments from './post'
import makeGetShipmentsById from './get-organization-id'
import makeGetShipmentsByOrganization from './get-organization'
import makePatchShipmentsById from './patch-id'
import makePatchShipmentsPositionById from './patch-id-position'
import makePostShipmentsDelayById from './post-id-delay'

export default function makeControllers(entities) {
    return Object.freeze({
        postShipments: makePostShipments(entities),
        getShipmentsById: makeGetShipmentsById(entities), 
        getShipmentsByOrganization: makeGetShipmentsByOrganization(entities),
        patchShipmentsById: makePatchShipmentsById(entities), 
        patchShipmentsPositionById: makePatchShipmentsPositionById(entities),
        postShipmentsDelayById: makePostShipmentsDelayById(entities)
    })
}