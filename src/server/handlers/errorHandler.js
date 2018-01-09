const errorHandler = async (error, request, response) => {
    response.status(500).send('Server Error')
}

module.exports = errorHandler