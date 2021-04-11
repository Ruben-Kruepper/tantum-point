import Joi from 'joi'

import { coordinateSchema } from '../utils/schemas'
import errors from '../utils/errors'

const requestSchema = Joi.object({
    customerId: Joi.string().required(),
    position: coordinateSchema,
    destination: coordinateSchema.required(),
    origin: coordinateSchema.required(),
    content: Joi.object(),
})

export default function makePostShipments(shipments) {
    return async function postShipments(req, res) {
        const { error, value: shipment } = requestSchema.validate(req.body)
        const success = await shipments.saveShipment(shipment)
        if (success) { res.status(200).send({ created: shipment }) }
        else { res.status(500).send({ error: errors.serverError }) }
    }
}