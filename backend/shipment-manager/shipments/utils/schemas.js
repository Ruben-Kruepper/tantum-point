import Joi from 'joi'

export const coordinateSchema = Joi.array().length(2).items(Joi.number())
