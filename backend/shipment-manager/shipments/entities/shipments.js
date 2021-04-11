import Joi from 'joi'
import { coordinateSchema } from '../utils/schemas'
import { ObjectId } from 'mongodb'

const shipmentSchema = Joi.object({
    _id: Joi.any(),
    customerId: Joi.string().required(),
    position: coordinateSchema,
    destination: coordinateSchema.required(),
    origin: coordinateSchema.required(),
    content: Joi.object(),
})

function makeSaveShipment(db) {
    return function saveShipment(shipment) {
        const { error, record: value } = shipmentSchema.validate(shipment)
        if (error) { throw error }
        if (shipment._id) {
            return db.collection('shipments').updateOne({ _id: shipment._id }, shipment, { upsert: true })
            .then(report => true)
            .catch(error => false)
        } else {
            return db.collection('shipments').insertOne(shipment)
            .then(report => true)
            .catch(error => false)
        }
        
    }
}

function makeGetShipmentById(db) {
    return function getShipmentById(shipmentId) {
        db.collection('shipments').findOne({ _id: ObjectId(shipmentId) })
        .then(report => {
            console.log(report)
        })
        .catch(error => {
            console.error(error)
        })
        return db.collection('shipments').findOne({ _id: ObjectId(shipmentId) })
    }
}

export default function makeShipments(db) {
    return Object.freeze({
        getShipmentById: makeGetShipmentById(db),
        saveShipment: makeSaveShipment(db)
    })
}

////////////////////////////////
// Helpers
////////////////////////////////