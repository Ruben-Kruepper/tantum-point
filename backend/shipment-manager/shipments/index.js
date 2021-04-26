import express from 'express'

import makeControllers from './controllers'

export default function makeShipmentsRouter(entities) {

    const controllers = makeControllers(entities)

    const shipmentsRouter = express.Router()

    shipmentsRouter.use(express.raw({ type: 'image/jpeg', limit: '500kb' }))
    shipmentsRouter.post('/', controllers.postShipments)
    shipmentsRouter.get('/:shipmentId', controllers.getShipmentsById)
    return shipmentsRouter
}

