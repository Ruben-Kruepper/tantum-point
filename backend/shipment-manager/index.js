import express from 'express'
import { MongoClient } from 'mongodb'

import makeShipmentsRouter from './shipments'

makeApp().then(({ app }) => {
    app.listen(process.env.SHIPMENT_MANAGER_PORT, () => {
        console.log('----- Shipment Manager -----')
        console.log(`Running on port ${process.env.SHIPMENT_MANAGER_PORT}`)
    })
})

async function makeApp() {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    try {
        await client.connect()
    } catch (e)  {
        console.error(e)
        throw Error('DB connection failed. Exiting...')
    }

    let db = null
    if (process.env.NODE_ENV === 'test') {
        db = client.db('test-database')
    } else {
        db = client.db('shipments')
    }

    
    
    const app = express()

    app.use(express.json())
    
    app.use(await makeShipmentsRouter(db))
    
    return { app, db }
}

export default makeApp