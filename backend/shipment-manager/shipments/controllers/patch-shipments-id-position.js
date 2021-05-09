import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePatchShipmentsPositionById({ shipments, organizations }) {
    return async function patchShipmentsPositionById(req, res) {
        if (!(req.query && req.query.editSecret)) {
            return res.status(400).send({ error: errors.malformedRequest })
        }
        let position = req.body.coordinates
        let shipment = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipment) { return res.status(404).send({ error: errors.notFound }) }
        if (shipment.editSecret !== req.query.editSecret) { return res.status(403).send({ error: errors.unauthorized }) }
        
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
            res.status(500).send({ errors: errors.serverError })
        }
    }
}