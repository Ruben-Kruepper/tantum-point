import express from 'express'

import makeControllers from './controllers'

export default function makeShipmentsRouter(entities) {
    
    const controllers = makeControllers(entities)
    
    const organizationsRouter = express.Router()

    organizationsRouter.post('/', controllers.postOrganizations)
    organizationsRouter.get('/:organizationId', controllers.getOrganizationsById)

    return organizationsRouter
}

