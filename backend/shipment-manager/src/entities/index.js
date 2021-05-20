import makeUsers from './users'
import makeOrganizations from './organizations'
import makeShipments from './shipments'


export default function makeEntities(db) {
    return Object.freeze({
        organizations: makeOrganizations(db),
        shipments: makeShipments(db),
        users: makeUsers(db)
    })
}