import axios from 'axios'

export default Object.freeze({
    queryAddressCoordinates,
    queryRoute,
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

async function queryRoute(position, destination) {
    return axios.get('https://atlas.microsoft.com/route/directions/json', {
        params: {
            'subscription-key': process.env.AZURE_MAPS_KEY,
            'api-version': '1.0',
            'query': `${position.lat},${position.lon}:${destination.lat},${destination.lon}`,
            'vehicleMaxSpeed': 80
        }
    })
        .then(response => {
            let eta = new Date()
            let travelTime = response.data.routes[0].summary.travelTimeInSeconds + 8 * 60 * 60
            travelTime = travelTime + (Math.floor((travelTime / 3600) / 8) * 16)
            eta.setSeconds(eta.getSeconds() + travelTime)
            let routePoints = []
            for (let i = 0; i < response.data.routes[0].legs[0].points.length; i = i + 3) {
                routePoints.push(response.data.routes[0].legs[0].points[i])
            }
            return {
                eta,
                routePoints
            }
        })
        .catch(error => {
            console.error(error)
            return null
        })
}