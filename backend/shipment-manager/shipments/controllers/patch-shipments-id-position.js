import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePatchShipmentsPositionById({ shipments, organizations }) {
    return async function patchShipmentsPositionById(req, res) {
        if (!(req.query && req.query.editSecret)) {
            return res.status(400).send({ error: errors.malformedRequest })
        }
        let position = req.body.coordinates
        let shipmentData = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipmentData) { return res.status(404).send({ error: errors.notFound }) }
        if (shipmentData.editSecret !== req.query.editSecret) { return res.status(403).send({ error: errors.unauthorized }) }
        shipmentData = { ...shipmentData, position }
        let shipment = await shipments.saveShipment(shipmentData)
        if (shipment) {
            res.status(200).send({ updated: shipment })
        } else {
            res.status(500).send({ errors: errors.serverError })
        }
    }
}