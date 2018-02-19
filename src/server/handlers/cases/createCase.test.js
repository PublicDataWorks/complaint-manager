const _ = require('lodash');
const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const models = require('../../models')
const auth0 = require('auth0')


jest.mock('../../models', () => ({
    cases: {
        create: jest.fn()
    },
    civilian: {
        create: jest.fn()
    },
    audit_log: {
        create: jest.fn()
    }

}))

jest.mock('auth0', () => ({
    AuthenticationClient: jest.fn().mockImplementation(() => {
        return {
            users: {
                getInfo: () => Promise.resolve({nickname: 'test user'})
            }
        }
    })
}))

describe('createCase handler', () => {
    let request, response, next


    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'POST',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                case: {
                    complainantType: "Civilian",
                    firstContactDate: "2018-02-08"
                },
                civilian: {
                    firstName: "First",
                    lastName: "Last",
                    phoneNumber: "1234567890"
                }
            }
        })
        response = httpMocks.createResponse()
        next = jest.fn()
    })

    test('should create case in database', () => {
        createCase(request, response, next)
        expect(models.cases.create).toHaveBeenCalledWith({
            ...request.body.case,
            civilians: [request.body.civilian]
        }, {
            include: [{
                model: models.civilian
            }]
        })
    })

    test('should create record of case creation in system audit log', async () => {
        const createdId = 123
        const createdCase = {id: createdId}
        models.cases.create.mockImplementation(() =>
            Promise.resolve(createdCase))

        await createCase(request, response, next)

        const expectedLog = {
            action: `Case ${createdCase.id} created`,
            caseId: createdCase.id,
            user: 'test user'
        }

        expect(models.audit_log.create).toHaveBeenCalledWith(expectedLog)
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

    test('should respond with 400 when civilian names are empty', async () => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                civilian: {
                    firstName: "",
                    lastName: ""
                }
            }
        })

        await createCase(request, response, next)

        expect(response.statusCode).toEqual(400)
    })

    test('should respond with 400 when name input is more than 25 characters', async () => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                civilian: {
                    firstName: "someveryveryveryveryveryveryveryveryveryveryverylongname",
                    lastName: "name"
                }
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
                civilian: {
                    firstName: "Valid",
                    lastName: "Name"
                }
            }
        })

        await createCase(request, response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})