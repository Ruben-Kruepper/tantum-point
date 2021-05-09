import { verify } from 'jsonwebtoken'
import errors from '../utils/errors'

export default Object.freeze({
    jwtAuth
})

function jwtAuth(req, res, next) {
    const token = req.headers.authorization
    verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return errors.invalidToken(res)
        }
        req.userData = decoded
        next()
    })
}