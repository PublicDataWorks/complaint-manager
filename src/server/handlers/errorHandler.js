const errorHandler = (error, request, response, next) => {
    response.status(500).send('Server Error')
}

module.exports = errorHandler