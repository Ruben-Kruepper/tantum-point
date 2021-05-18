import express from 'express'

import makeControllers from './controllers'
import middleware from '../middleware'

export default function makeShipmentsRouter(entities) {

    const controllers = makeControllers(entities)

    const shipmentsRouter = express.Router()

    shipmentsRouter.use(express.raw({ type: 'image/jpeg', limit: '4mb' }))

    // not protected by jwt
    shipmentsRouter.post('/', controllers.postShipments)
    shipmentsRouter.patch('/:shipmentId', controllers.patchShipmentsById)
    shipmentsRouter.patch('/:shipmentId/position', controllers.patchShipmentsPositionById)
    shipmentsRouter.post('/:shipmentId/delay', controllers.postShipmentsDelayById)
    
    shipmentsRouter.use(middleware.jwtAuth)
    // protected by jwt
    shipmentsRouter.get('/:organization/:shipmentId', controllers.getShipmentsById)
    shipmentsRouter.get('/:organization', controllers.getShipmentsByOrganization)
    
    return shipmentsRouter
}

