import axios from 'axios'

export default Object.freeze({
    queryAddressCoordinates
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
            return {
                lat: -1,
                lon: -1
            }
        })
}