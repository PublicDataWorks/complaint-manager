const httpMocks = require('node-mocks-http')
const getCases = require('./getCases')
const models = require('../../models/index')

jest.mock('../../models', () => ({
    cases: {
        findAll: jest.fn()
    }
}))

describe('getCases handler', () => {
    let request, response

    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'GET'
        })
        response = httpMocks.createResponse()
    })

    test('should successfully respond with all cases in database', async () => {
        const allCases = 'all cases'
        models.cases.findAll.mockImplementation(() =>
            Promise.resolve(allCases))

        await getCases(request, response)

        expect(response.statusCode).toEqual(200)
        expect(response._getData()).toEqual({
            cases: allCases
        })
    })
})
