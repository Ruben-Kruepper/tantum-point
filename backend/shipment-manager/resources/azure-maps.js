import axios from 'axios'

export default Object.freeze({
    queryAddressCoordinates,
    queryETA,
})

async function queryAddressCoordinates(address) {
    return axios.get('https://atlas.microsoft.com/search/address/json', {
        params: {
            'subscription-key': process.env.AZURE_MAPS_KEY,
            'api-version': '1.0',
            'language': 'en-US',
            'query': address
        }
    })
        .then(response => {
            return response.data.results[0].position
        })
        .catch(error => {
            console.error(error)
            return null
        })
}

async function queryETA(position, destination) {
    return axios.get('https://atlas.microsoft.com/route/directions/json', {
        params: {
            'subscription-key': process.env.AZURE_MAPS_KEY,
            'api-version': '1.0',
            'query': `${position.lat},${position.lon}:${destination.lat},${destination.lon}`,
            'vehicleMaxSpeed': 80
        }
    })
        .then(response => {
            return response.data.routes[0].summary.travelTimeInSeconds
        })
        .catch(error => {
            console.error(error)
            return null
        })
}