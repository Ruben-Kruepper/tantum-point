import errors from "../../utils/errors"

export default function makeGetShipmentsByOrganization({ shipments }) {
    return async function getShipmentsByOrganization(req, res) {
        const organization = req.params.organization
        if (req.userData.organization !== organization) { return errors.unauthorized(res) }
        const allShipments = await shipments.getShipmentsBySenderOrganization(organization)
        res.status(200).send({ shipments: allShipments })
    }
}

