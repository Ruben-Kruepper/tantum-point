export default Object.freeze({
    invalidToken: (res) => res.status(401).send({ error: 'authorization token invalid' }), 
    serverError: (res) => res.status(500).send({ error: 'internal server error' }),
    malformedRequest: (res) => res.status(400).send({ error: 'request invalid or malformed' }),
    notFound: (res) => res.status(404).send({ error: 'resource not found' }),
    unauthorized: (res) => res.status(403).send({ error: 'not authorized' })
})