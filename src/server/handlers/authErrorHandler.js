const authErrorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ error: 'invalid token...' })
    } else if (err.name === 'UserProfileFetchError') {
        res.status(500).send({ error: err.message })
    } else {
        next(err)
    }
}

module.exports = authErrorHandler