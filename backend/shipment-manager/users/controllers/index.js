import makePostLogin from './post-login'
import makePostRegister from './post-register'

export default function makeControllers(entities) {
    return Object.freeze({
        postLogin: makePostLogin(entities),
        postRegister: makePostRegister(entities)
    })
}