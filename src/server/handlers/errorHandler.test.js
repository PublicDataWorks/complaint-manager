const errorHandler = require('./errorHandler')
const httpMocks = require('node-mocks-http')

describe('errorHandler', () => {
    let request, response

    beforeEach(() => {
        request = httpMocks.createRequest()
        response = httpMocks.createResponse()

        errorHandler(new Error(), request, response)
    })
    test('should send 500 response status', () => {
        expect(response.statusCode).toEqual(500)
        expect(response._isEndCalled()).toBeTruthy()
    })

    test('should respond with error message', () => {
        expect(response._getData()).toEqual('Server Error')
    })
})