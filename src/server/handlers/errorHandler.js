const errorHandler = async (error, request, response) => {
    console.log(error)
    response.status(500).send('Server Error')
}

module.exports = errorHandler