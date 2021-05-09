import errors from "../../utils/errors"

export default function makeGetShipmentsById({ shipments }) {
    return async function getShipmentsById(req, res) {
        const shipmentId = req.params.shipmentId
        const shipment = await shipments.getShipmentById(shipmentId)
        if (req.userData.organization !== shipment.senderOrganization) { return errors.unauthorized(res)}
        res.status(200).send(shipment)
    }
}