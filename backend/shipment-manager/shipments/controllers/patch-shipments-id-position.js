import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePatchShipmentsPositionById({ shipments, organizations }) {
    return async function patchShipmentsPositionById(req, res) {
        if (!(req.query && req.query.editSecret)) {
            return errors.malformedRequest(res)
        }
        let position = req.body.coordinates
        let shipment = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipment) { return errors.notFound(res) }
        if (shipment.editSecret !== req.query.editSecret) { return errors.unauthorized(res) }
        
        shipment.position = position        
        const now = new Date()
        if (!shipment.eta) { shipment.eta = {} }
        if (!shipment.eta.updatedAt || (shipment.eta.updatedAt - now) / 1000 / 60 > 5) {
            shipment.eta.updatedAt = now
            shipment.eta.value = await azureMaps.queryETA(shipment.position, shipment.destinationCoordinates)
        }
        shipment = await shipments.saveShipment(shipment)
        if (shipment) {
            res.status(200).send({ updated: shipment })
        } else {
            errors.serverError(res)
        }
    }
}