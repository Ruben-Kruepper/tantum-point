import express from 'express'

import makeControllers from './controllers'
import makeShipments from './entities/shipments.js'

export default async function makeShipmentsRouter(db) {
    
    const shipments = makeShipments(db)
    const controllers = makeControllers(shipments)
    
    const shipmentsRouter = express.Router()

    shipmentsRouter.post('/shipments', controllers.postShipments)
    shipmentsRouter.get('/shipments/:shipmentId', controllers.getShipmentsById)

    return shipmentsRouter
}

