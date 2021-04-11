import { verify } from 'jsonwebtoken'
import { errors } from '../utils/errors'

export default Object.freeze({

})

function jwtAuth(req, res, next) {
    const token = req.headers['Authorization']
    verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).send({ error: errors.invalidToken })
            return
        }
        req.userData = decoded
        next()
    })
}