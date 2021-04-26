import Joi from 'joi'

import errors from '../../utils/errors'


const requestSchema = Joi.object({
    name: Joi.string().required(),
    secret: Joi.string().required()
})

export default function makePostOrganizations({ organizations }) {
    return async function postOrganizations(req, res) {
        const { error, value: organization } = requestSchema.validate(req.body)
        const success = await organizations.saveOrganization(organization)
        if (success) { res.status(200).send({ created: organization }) }
        else { res.status(500).send({ error: errors.serverError }) }
    }
}