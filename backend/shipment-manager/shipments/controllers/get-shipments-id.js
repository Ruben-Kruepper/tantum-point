export default function makeGetShipmentsById(shipments) {
    return async function getShipmentsById(req, res) {
        const shipmentId = req.params.shipmentId
        const shipment = await shipments.getShipmentById(shipmentId)
        res.status(200).send(shipment)
    }
}