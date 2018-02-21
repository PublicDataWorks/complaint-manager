const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const models = require('../../models')

describe('create case transaction', () => {
    test('should not commit transaction when audit logging fails', async () => {
        const requestWithBadDataForAudit = httpMocks.createRequest({
            method: 'POST',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                case: {
                    complainantType: "Civilian",
                    firstContactDate: "2018-02-08",
                    createdBy: 'test_user',
                    assignedTo: 'test_user'
                },
                civilian: {
                    firstName: "First",
                    lastName: "Last",
                    phoneNumber: "1234567890"
                }
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        const expectedNumCases = await models.cases.count()

        await createCase(requestWithBadDataForAudit, response, jest.fn())

        const actualNumCases = await models.cases.count()

        expect(expectedNumCases).toEqual(actualNumCases)
    })
});