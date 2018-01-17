const errorHandler = (error, request, response, next) => {
    console.log(error)
    response.status(500).send('Server Error')
}

module.exports = errorHandler