import Joi from 'joi'
import crypto from 'crypto'

import azureMaps from '../../resources/azure-maps'
import azureOCR from '../../resources/azure-ocr'
import errors from '../../utils/errors'


export default function makePostShipments({ shipments }) {
    return async function postShipments(req, res) {
        // extract as much shipment info from the ocr as possible
        // const ocrData = await azureOCR.queryOCR(Buffer.from(req.body.toString(), 'base64'))
        let shipmentData = extractShipmentData('')
        shipmentData.sender.organization = 'Example Ltd.' // temporary until proper organization logic is added
        shipmentData.route.destination.coordinates = await azureMaps.queryAddressCoordinates(shipmentData.route.destination.address)
        shipmentData.route.sender.coordinates = await azureMaps.queryAddressCoordinates(shipmentData.route.sender.address)
        shipmentData.editSecret = crypto.randomBytes(32).toString('hex')
        shipmentData.createdAt = new Date()
        shipmentData.route.eta.updatedAt = shipmentData.createdAt
        const { eta, routePoints } = await azureMaps.queryRoute(shipmentData.route.sender.coordinates, shipmentData.route.destination.coordinates)
        shipmentData.route.eta.value = eta
        shipmentData.route.points = routePoints
        let shipment = await shipments.saveShipment(shipmentData)
        if (shipment) {
            res.status(200).send({ created: shipment })
        } else {
            errors.serverError(res)
        }
    }
}

function extractShipmentData(ocrData) {
    // TODO delegate to a python service
    return {
        route: {
            sender: {
                address: 'Am Neuen Rheinhafen 11 67346 Speyer Germany'
            },
            destination: {
                address: 'DIAMOND BUSINESS PARK, SZAMOTY, 02-495, WARSAW, POLAND'
            }, 
            eta: {
                targetDeliveryDate: new Date('05-30-2021')
            }
        },
        destination: {},
        sender: {
            references: {
                Auftragsnr: '66135300',
                Lieferscheinr: '80141107',
                Transportnr: '10129456',
                Bestnr: '4501349201-00080',
                Kundennr: '1767248',
                Kunde: 'The Destination Company'
            },
            conditions: {
                Versand: 'Truck-Tank',
                Lieferung: 'CCI Warsaw',
                Verladedatum: '20.05.2021',
                Lieferdatum: '30.05.2021'
            },
            subscribers: [
                'logistics.manager@example.com',
                'destination.accountmanager@example.com'
            ]
        }
    }
}