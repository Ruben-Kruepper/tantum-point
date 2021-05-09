import Joi from 'joi'
import joiObjectid from 'joi-objectid'
Joi.objectId = joiObjectid(Joi)
import { coordinateSchema } from '../utils/schemas'
import { ObjectId } from 'mongodb'

const userSchema = Joi.object({
    _id: Joi.objectId(),
    username: Joi.string().email().required(),
    hashedPassword: Joi.string().required(),
    organization: Joi.string().required()
})

function makeSaveUser(db) {
    return function saveUser(user) {
        const { error, record: value } = userSchema.validate(user)
        if (error) { return {
            user: undefined,
            error: 'badUser'
        }}

        let userId = user._id
        delete user._id
        if (userId) {
            return db.collection('users').findOneAndUpdate({ _id: ObjectId(userId) }, { $set: user }, { upsert: true, returnNewDocument: false })
                .then(report => ({
                    user: report.value,
                    error: undefined
                }))
                .catch(error => {
                        console.error(error)
                        return { user: undefined, error: 'unknownError'}
                })
        } else {
            return db.collection('users').insertOne(user)
                .then(report => ({
                    user: report.ops[0],
                    error: undefined
                }))
                .catch(error => {
                    console.error(error)
                    return { user: undefined, error: 'unknownError'}
                })
        }

    }
}

function makeGetUserByUsername(db) {
    return function getUserByUsername(username) {
        return db.collection('users').findOne({ username })
    }
}

export default function makeUsers(db) {
    return Object.freeze({
        saveUser: makeSaveUser(db),
        getUserByUsername: makeGetUserByUsername(db)
    })
}