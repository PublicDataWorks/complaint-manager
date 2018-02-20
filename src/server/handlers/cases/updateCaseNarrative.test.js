const httpMocks = require("node-mocks-http");
const models = require('../../models/index')
const updateCaseNarrative = require('./updateCaseNarrative')

jest.mock('../../models', () => ({
    cases: {
        update: jest.fn(),
        findById: jest.fn()
    },
    civilian: jest.fn(),
    audit_log: {
        create: jest.fn()
    }
}))

describe('updateCaseNarrative handler', () => {
    let request, response, userNickname

    beforeEach(() => {
        userNickname = 'test_user'
        request = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            params: {
                id: 1
            },
            body: {
                narrative: "So much narrative"
            },
            nickname: userNickname
        })

        response = httpMocks.createResponse()
    })

    test('should update case and include civilians', () => {
        updateCaseNarrative(request, response, jest.fn())

        expect(models.cases.update).toHaveBeenCalledWith({
            narrative: request.body.narrative
        }, {
            where: {id: request.params.id},
            individualHooks: true
        })
    })

    test('should send a 200 response and updated case when updating narrative', async () => {
        const updatedCase = 'updated case'
        models.cases.update.mockImplementation(() => Promise.resolve())
        models.cases.findById.mockImplementation(() => Promise.resolve(updatedCase))
        models.audit_log.create.mockImplementation(() => Promise.resolve())

        await updateCaseNarrative(request, response, jest.fn())

        expect(response._getStatusCode()).toEqual(200)
        expect(response._getData()).toEqual(updatedCase)
        expect(response._isEndCalled()).toBeTruthy()
    })

    test('should log on update', () => {
        const expectedLog = {
            action: `Case ${request.params.id} narrative updated`,
            caseId: request.params.id,
            user: userNickname
        }

        models.cases.update.mockImplementation(() => Promise.resolve())
        models.cases.findById.mockImplementation(() => Promise.resolve())

        updateCaseNarrative(request, response, jest.fn())

        expect(models.audit_log.create).toHaveBeenCalledWith(expectedLog)
    })
})
