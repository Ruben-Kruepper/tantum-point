import Joi from 'joi'

import azureMaps from '../../resources/azure-maps'
import errors from '../../utils/errors'


export default function makePostShipmentsDelayById({ shipments }) {
    return async function postShipmentsDelayById(req, res) {
        if (!(req.query && req.query.editSecret)) {
            return errors.malformedRequest(res)
        }
        let { coordinates, until, reason } = req.body.delay
        until = new Date(Date.parse(until))
        let shipment = await shipments.getShipmentById(req.params.shipmentId)
        if (!shipment) { return errors.notFound(res) }
        if (shipment.editSecret !== req.query.editSecret) { return errors.unauthorized(res) }
        
        const now = new Date()
        shipment.route.delay = { at: coordinates, until }
        if (reason) { shipment.route.delay.reason = reason }        
        const { eta, routePoints } = await azureMaps.queryRoute(shipment.route.delay.at, shipment.route.destination.coordinates)
        eta.setSeconds(eta.getSeconds() + ((until - now)/1000))
        shipment.route.eta.value = eta
        shipment.route.points = routePoints
        shipment.route.eta.updatedAt = now

        shipment = await shipments.saveShipment(shipment)
        if (shipment) {
            res.status(204).send()
        } else {
            errors.serverError(res)
        }
    }
}