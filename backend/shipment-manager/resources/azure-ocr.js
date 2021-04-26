import axios from 'axios'

export default Object.freeze({
    queryOCR
})

async function queryOCR(imageBinaryData) {
    try {
        let response = await axios.post(
            process.env.AZURE_OCR_ENDPOINT,
            imageBinaryData, {
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.AZURE_OCR_KEY,
                'Content-Type': 'image/jpeg'
            },
        })
        const resultURL = response.headers['operation-location']
        let status = 'notStarted'
        while (status === 'notStarted' || status === 'running') {
            await new Promise(resolve => setTimeout(resolve, 1000))
            response = await axios.get(resultURL, { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_OCR_KEY } })
                .then(response => {
                    status = response.data.status
                    return response
                })
        }
        if (status === 'succeeded') {
            return response.data.analyzeResult.readResults[0].lines
        } else {
            throw Error('failed')
        }
    } catch (e) {
        console.error(e)
        return { status: 'failed' }
    }
}