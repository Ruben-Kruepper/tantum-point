import makePostOrganizations from './post-organizations'
import makeGetOrganizationsById from './get-organizations-id'

export default function makeControllers(entities) {
    return Object.freeze({
        postOrganizations: makePostOrganizations(entities),
        getOrganizationsById: makeGetOrganizationsById(entities)
    })
}