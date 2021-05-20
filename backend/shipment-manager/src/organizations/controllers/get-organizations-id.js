export default function makeGetOrganizationsById({ organizations }) {
    return async function getOrganizationsById(req, res) {
        const organizationId = req.params.organizationId
        const organization = await organizations.getOrganizationById(organizationId)
        res.status(200).send(organization)
    }
}