const AuthClient = require('auth0').AuthenticationClient
const config = require('../config/config')[process.env.NODE_ENV]
const unless = require('express-unless')

const extractAccessToken = (authHeader) => {
    const headerParts = authHeader.split(' ')
    if (headerParts.length !== 2) {
        throw new Error('Malformed authorization header')
    }
    return headerParts[1]
}

let getUserProfile = async (request, response, next) => {
    try {
        const auth = new AuthClient({
            domain: config.authentication.domain
        })

        const accessToken = extractAccessToken(request.headers.authorization)

        const userInfo = await auth.users.getInfo(accessToken)

        if (!userInfo.nickname) {
            const err = new Error('Could not retrieve user profile')
            err.name = 'UserProfileFetchError'
            next(err)
        } else {
            request.nickname = userInfo.nickname
            next()
        }

    } catch (e) {
        next(e)
    }
}

getUserProfile.unless = unless

module.exports = getUserProfile