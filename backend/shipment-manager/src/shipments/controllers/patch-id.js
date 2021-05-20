import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePatchShipmentsById({ shipments, organizations }) {
    return async function patchShipmentsById(req, res) {
        if (!(req.query && req.query.editSecret) || !(req.body && req.body.update)) {
            return errors.malformedRequest(res)
        }
        let updateData = req.body.update
        let shipmentData = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipmentData) { return errors.notFound(res) }
        if (shipmentData.editSecret !== req.query.editSecret) { return errors.unauthorized(res) }
        shipmentData = { ...shipmentData, ...updateData }
        shipmentData.route.destination.coordinates = await azureMaps.queryAddressCoordinates(shipmentData.route.destination.address)
        let shipment = await shipments.saveShipment(shipmentData)
        if (shipment) {
            res.status(200).send({ updated: shipment })
        } else {
            errors.serverError(res)
        }
    }
}