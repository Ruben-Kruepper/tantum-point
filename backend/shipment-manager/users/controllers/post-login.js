import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import errors from '../../utils/errors'

const requestSchema = Joi.object({
    loginData: Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().required()
    }).required()
})

export default function makePostLogin({ users }) {
    return async function postLogin(req, res) {
        const { error, value: { loginData } } = requestSchema.validate(req.body, { stripUnkown: true })
        const { username, password } = loginData
        if (error) { return errors.malformedRequest(res) }

        const user = await users.getUserByUsername(username)
        if (!user) { return errors.notFound(res) }

        const match = await bcrypt.compare(password, user.hashedPassword)
        if (!match) { return errors.invalidToken(res) }

        jwt.sign({ username, organization: user.organization }, process.env.JWT_SECRET, (error, token) => {
            if (error) { return errors.serverError(res) }
            return res.status(200).send({ token, decoded: { username, organization: user.organization } })
        })
    }
}