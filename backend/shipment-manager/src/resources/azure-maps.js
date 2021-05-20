import axios from 'axios'

export default Object.freeze({
    queryAddressCoordinates,
    queryRoute,
    getGreatCircleDistance
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
            let travelTime = response.data.routes[0].summary.travelTimeInSeconds + 16 * 60 * 60
            travelTime = travelTime + (Math.floor((travelTime / 3600) / 7) * 16)
            eta.setSeconds(eta.getSeconds() + travelTime)
            let routePoints = []
            for (let i = 0; i < response.data.routes[0].legs[0].points.length; i = i + 3) {
                routePoints.push({ lat: response.data.routes[0].legs[0].points[i].latitude, lon: response.data.routes[0].legs[0].points[i].longitude })
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

function getGreatCircleDistance(from, to) {
    const R = 6371
    const phi1 = from.lat * Math.PI/180
    const phi2 = to.lat * Math.PI/180
    const dphi = (to.lat-from.lat) * Math.PI/180
    const dlambda = (to.lon-from.lon) * Math.PI/180

    const a = Math.sin(dphi/2) * Math.sin(dphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda/2) * Math.sin(dlambda/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c 
}