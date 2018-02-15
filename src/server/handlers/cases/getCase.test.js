const httpMocks = require("node-mocks-http")
const models = require('../../models/index')
const getCase = require('./getCase')

jest.mock('../../models', () => ({
    cases: {
        findById: jest.fn(),
    },
    civilian: jest.fn()
}))

describe('get case', () => {
    test('should find a single case when requested', () => {
        const request = httpMocks.createRequest({
            method: 'GET',
            params: {
                id: 1
            },
        })

        const response = httpMocks.createResponse()

        getCase(request, response, jest.fn())

        expect(models.cases.findById).toHaveBeenCalledWith(1,
            {
                include: {model: models.civilian}
            })
    })
})
