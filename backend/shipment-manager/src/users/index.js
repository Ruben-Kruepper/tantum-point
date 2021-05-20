import express from 'express'

import makeControllers from './controllers'

export default function makeUsersRouter(entities) {

    const controllers = makeControllers(entities)

    const usersRouter = express.Router()
    
    usersRouter.post('/login', controllers.postLogin)
    usersRouter.post('/register', controllers.postRegister)
    
    return usersRouter
}
