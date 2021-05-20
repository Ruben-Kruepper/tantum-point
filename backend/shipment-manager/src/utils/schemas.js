import Joi from 'joi'

export const coordinateSchema = Joi.object({
    lon: Joi.number().required(),
    lat: Joi.number().required()
})