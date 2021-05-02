import Joi from 'joi'
import crypto from 'crypto'

import azureMaps from '../../resources/azure-maps'
import azureOCR from '../../resources/azure-ocr'
import errors from '../../utils/errors'


export default function makePostShipments({ shipments, organizations }) {
    return async function postShipments(req, res) {
        // extract as much shipment info from the ocr as possible
        const ocrData = await azureOCR.queryOCR(Buffer.from(req.body.toString(), 'base64'))
        let shipmentData = extractShipmentData(ocrData)
        shipmentData.destinationCoordinates = await azureMaps.queryAddressCoordinates(shipmentData.destinationAddress)
        shipmentData.editSecret = crypto.randomBytes(32).toString('hex')
        let shipment = await shipments.saveShipment(shipmentData)
        if (shipment) {
            res.status(200).send({ created: shipment })
        } else {
            res.status(500).send({ errors: errors.serverError })
        }
    }
}

function extractShipmentData(ocrData) {
    let shipmentData = {}
    // address of dest
    shipmentData.destinationAddress = (ocrData.find(({ text }) => text.match(/^(\p{L})+\s+((([0-9]{1,3})-([0-9]{1,3}))|[0-9]{1,3})$/gu)) || { text: '' }).text
    shipmentData.destinationAddress += (shipmentData.destinationAddress ? ' ' : '') + (ocrData.find(({ text }) => text.match(/^[0-9]{5}\s+(\p{L}|\s)+/gu)) || { text: '' }).text
    // find shipment id-number
    shipmentData.internalShipmentId = (ocrData.find(({ text }) => text.match(/^[0-9]{8}$/)) || { text: null }).text
    // find customer id-number
    shipmentData.customerId = (ocrData.find(({ text }) => text.match(/^[0-9]{7}$/)) || { text: null }).text
    return shipmentData
}