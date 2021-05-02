import axios from 'axios'

export default Object.freeze({
    queryOCR
})

async function queryOCR(imageBinaryData) {
    try {
        let response = await axios.post(
            process.env.AZURE_OCR_ENDPOINT,
            imageBinaryData,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_OCR_KEY,
                    'Content-Type': 'image/jpeg'
                },
            })
            .catch(error => console.error(error.response))
        const resultURL = response.headers['operation-location']
        let status = 'notStarted'
        await new Promise(resolve => setTimeout(resolve, 2000))
        while (status === 'notStarted' || status === 'running') {
            await new Promise(resolve => setTimeout(resolve, 500))
            response = await axios.get(resultURL, { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_OCR_KEY } })
                .then(response => {
                    console.log(response.status)
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
        console.error(error.response)
        return { status: 'failed' }
    }
}