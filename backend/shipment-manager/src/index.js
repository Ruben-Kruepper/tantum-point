import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'

import makeShipmentsRouter from './shipments'
import makeOrganizationsRouter from './organizations'
import makeUsersRouter from './users'
import makeEntities from './entities'

makeApp().then(({ app }) => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`\n\nListening on ${process.env.PORT || 3000}`)
    })
})

async function makeApp() {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    try {
        await client.connect()
    } catch (e) {
        console.error(e)
        throw Error('DB connection failed. Exiting...')
    }

    let db = null
    if (process.env.NODE_ENV === 'test') {
        db = client.db('test-database')
    } else {
        db = client.db('shipment-manager')
    }

    const entities = makeEntities(db)

    const app = express()
    app.use(cors({ origin: 'http://demo.tantumpoint.com' }))

    app.use(express.json({ limit: '8mb' }))

    app.get('/', (req, res) => res.send('Welcome to TTP'))

    app.use('/users', makeUsersRouter(entities))
    app.use('/shipments', makeShipmentsRouter(entities))
    app.use('/organizations', makeOrganizationsRouter(entities))

    return { app, db }
}

export default makeApp