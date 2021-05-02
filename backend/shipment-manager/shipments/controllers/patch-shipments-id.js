import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePatchShipmentsById({ shipments, organizations }) {
    return async function patchShipmentsById(req, res) {
        if (!(req.query && req.query.editSecret) || !(req.body && req.body.update)) {
            return res.status(400).send({ error: errors.malformedRequest })
        }
        let updateData = req.body.update
        let shipmentData = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipmentData) { return res.status(404).send({ error: errors.notFound }) }
        if (shipmentData.editSecret !== req.query.editSecret) { return res.status(403).send({ error: errors.unauthorized }) }
        shipmentData = { ...shipmentData, ...updateData }
        shipmentData.destinationCoordinates = await azureMaps.queryAddressCoordinates(shipmentData.destinationAddress)
        let shipment = await shipments.saveShipment(shipmentData)
        if (shipment) {
            res.status(200).send({ updated: shipment })
        } else {
            res.status(500).send({ errors: errors.serverError })
        }
    }
}