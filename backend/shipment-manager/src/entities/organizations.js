import Joi from 'joi'
import { ObjectId } from 'mongodb'

const organizationSchema = Joi.object({
    _id: Joi.any(),
    name: Joi.string().required(),
    signingSecret: Joi.string().required()
})

function makeSaveOrganization(db) {
    return function saveOrganization(organization) {
        const { error, record: value } = organizationSchema.validate(organization)
        if (error) { return false }
        if (organization._id) {
            return db.collection('organizations').updateOne({ _id: organization._id }, organization, { upsert: true })
            .then(report => report.ops[0]._id)
            .catch(error => false)
        } else {
            return db.collection('organizations').insertOne(organization)
            .then(report => report.ops[0]._id)
            .catch(error => false)
        }
    }
}

function makeGetOrganizationById(db) {
    return async function getOrganizationById(organizationId) {
        return db.collection('organizations').findOne({ _id: ObjectId(organizationId) })
    }
}

export default function makeOrganizations(db) {
    return Object.freeze({
        getOrganizationById: makeGetOrganizationById(db),
        saveOrganization: makeSaveOrganization(db)
    })
}