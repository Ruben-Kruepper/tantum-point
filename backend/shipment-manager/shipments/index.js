import express from 'express'

import makeControllers from './controllers'

export default function makeShipmentsRouter(entities) {

    const controllers = makeControllers(entities)

    const shipmentsRouter = express.Router()

    shipmentsRouter.use(express.raw({ type: 'image/jpeg', limit: '4mb' }))
    
    shipmentsRouter.post('/', controllers.postShipments)
    shipmentsRouter.get('/:organization/:shipmentId', controllers.getShipmentsById)
    shipmentsRouter.get('/:organization', controllers.getShipmentsByOrganization)
    shipmentsRouter.patch('/:shipmentId', controllers.patchShipmentsById)
    shipmentsRouter.patch('/:shipmentId/position', controllers.patchShipmentsPositionById)
    
    return shipmentsRouter
}

