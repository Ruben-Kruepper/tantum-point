import Joi from 'joi'
import joiObjectid from 'joi-objectid'
Joi.objectId = joiObjectid(Joi)
import { coordinateSchema } from '../utils/schemas'
import { ObjectId } from 'mongodb'

const shipmentSchema = Joi.object({
    _id: Joi.objectId(),
    internalShipmentId: Joi.string(),
    position: coordinateSchema,
    originAddress: Joi.string(),
    originCoordinates: coordinateSchema,
    destinationAddress: Joi.string(),
    destinationCoordinates: coordinateSchema.required(),
    content: Joi.object()
})

function makeSaveShipment(db) {
    return function saveShipment(shipment) {
        // const { error, record: value } = shipmentSchema.validate(shipment)
        let record = shipment
        let error = null
        if (error) { throw error }
        let shipmentId = shipment._id
        delete shipment._id
        if (shipmentId) {
            return db.collection('shipments').findOneAndUpdate({ _id: ObjectId(shipmentId) }, { $set: shipment }, { upsert: true, returnNewDocument: false })
            .then(report => report.value)
            .catch(error => {
                    console.error(error)
                    return null
                })
        } else {
            return db.collection('shipments').insertOne(shipment)
                .then(report => report.ops[0])
                .catch(error => {
                    console.error(error)
                    return null
                })
        }

    }
}

function makeGetShipmentById(db) {
    return function getShipmentById(shipmentId) {
        return db.collection('shipments').findOne({ _id: ObjectId(shipmentId) })
    }
}

function makeGetShipmentsBySenderOrganization(db) {
    return function getShipmentsBySenderOrganization(organization) {
        return db.collection('shipments').find({ 'sender.organization': organization}).toArray()
    }
}

export default function makeShipments(db) {
    return Object.freeze({
        getShipmentById: makeGetShipmentById(db),
        saveShipment: makeSaveShipment(db), 
        getShipmentsBySenderOrganization: makeGetShipmentsBySenderOrganization(db)
    })
}