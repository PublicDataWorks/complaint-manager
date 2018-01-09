const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const models = require('../models')

jest.mock('../models', () => ({
    cases: {
        create: jest.fn()
    }
}))

describe('createCase handler', () => {
    let request, response, next

    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                firstName: "First",
                lastName: "Last"
            }
        })
        response = httpMocks.createResponse()
        next = jest.fn()
    })

    test('should create case in database', () => {
        createCase(request, response, next)
        expect(models.cases.create).toHaveBeenCalledWith(request.body)
    })

    test('should send response and 201 status with created entity', async () => {
        const createdCase = 'new created case'
        models.cases.create.mockImplementation(() =>
            Promise.resolve(createdCase))

        await createCase(request, response, next)

        expect(response.statusCode).toEqual(201)
        expect(response._getData()).toEqual(createdCase)
        expect(response._isEndCalled()).toBeTruthy()
    })

    test('should respond with 400 when body has empty inputs', async () => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                firstName: "",
                lastName: ""
            }
        })

        await createCase(request, response, next)

        expect(response.statusCode).toEqual(400)
    })

    test('should respond with 400 when name input is more than 25 characters', async () => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                firstName: "someveryveryveryveryveryveryveryveryveryveryverylongname",
                lastName: "name"
            }
        })

        await createCase(request, response, next)

        expect(response.statusCode).toEqual(400)
    })

    test('should call next when case creation fails', async () => {
        const error = new Error('DB Down!')
        models.cases.create.mockImplementation(() =>
            Promise.reject(error))

        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                firstName: "Valid",
                lastName: "Name"
            }
        })

        await createCase(request, response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})