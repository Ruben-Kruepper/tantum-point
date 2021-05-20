import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import errors from '../../utils/errors'

const requestSchema = Joi.object({
    registrationData: Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().min(10).required()
    }).required()
})

export default function makePostRegister({ users }) {
    return async function postRegister(req, res) {
        let { error, value: { registrationData } } = requestSchema.validate(req.body, { stripUnkown: true })
        if (error) {
            console.error(error) 
            return errors.malformedRequest(res) }
        const { username } = registrationData
        const hashedPassword = await bcrypt.hash(registrationData.password, parseInt(process.env.HASH_SALT_ROUNDS))
        let user
        ({ user, error } = await users.saveUser({
            username,
            hashedPassword,
            organization: 'Example Ltd.' // temporary until proper organization logic is added
        }))

        if (error) {
            if (error.type === 'userExistsError') { return errors.resourceExists(res) }
        }

        jwt.sign({ username, organization: user.organization }, process.env.JWT_SECRET, (error, token) => {
            if (error) { return errors.serverError(res) }
            return res.status(200).send({ token, userDetails: { username, organization: user.organization } })
        })
    }
}