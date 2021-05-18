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
        if (shipment.route.delay) {
            if (azureMaps.getGreatCircleDistance(shipment.route.delay.at, position) > 20) {
                // remove delay and proceed to normal tracking
                delete shipment.route.delay
            } else { // hasn't moved far enough, terminate here
                return res.status(204).send()
            }
        }
        shipment.route.position = position
        const now = new Date()
        if (!shipment.route.eta.updatedAt || (shipment.route.eta.updatedAt - now) / 1000 / 60 > 5) {
            shipment.route.eta.updatedAt = now
            const { eta, routePoints } = await azureMaps.queryRoute(shipment.route.position, shipment.route.destination.coordinates)
            shipment.route.eta.value = eta
            shipment.route.points = routePoints
        }
        shipment = await shipments.saveShipment(shipment)
        if (shipment) {
            res.status(200).send({ updated: shipment })
        } else {
            errors.serverError(res)
        }
    }
}