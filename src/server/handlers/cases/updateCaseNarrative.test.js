const httpMocks = require("node-mocks-http");
const models = require('../../models/index')
const updateCaseNarrative = require('./updateCaseNarrative')

jest.mock('../../models', () => ({
    cases: {
        update: jest.fn(),
    },
    civilian: jest.fn()
}))

describe('updateCaseNarrative handler', () => {
    test('should update case and include civilians', () => {
        const request = httpMocks.createRequest({
            method: 'PUT',
            params: {
                id: 1
            },
            body: {
                narrative: "So much narrative"
            }
        })

        const response = httpMocks.createResponse()

        updateCaseNarrative(request, response, jest.fn())

        expect(models.cases.update).toHaveBeenCalledWith({
            narrative: request.body.narrative
        }, {
            where: {id: request.params.id},
            individualHooks: true
        })
    })
})
