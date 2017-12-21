const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const models = require('../models')

jest.mock('../models', () => {
    return {
        cases: {
            create: jest.fn()
        }
    }
})

describe('createCase handler', () => {
    let request, response

    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: 'case request body'
        })
        response = httpMocks.createResponse()
    })

    test('should create case in database', () => {
        createCase(request, response)
        expect(models.cases.create).toHaveBeenCalledWith(request.body)
    })

    test('should send response with created entity', async () => {
        const createdCase = 'new created case'
        models.cases.create.mockImplementation(() => Promise.resolve(createdCase))

        await createCase(request, response)

        expect(response._getData()).toEqual(createdCase)
        expect(response._isEndCalled()).toBeTruthy()
    })
})