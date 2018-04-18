const httpMocks = require('node-mocks-http');
const audit = require('./audit');
const models = require('../../models/index');

jest.mock('../../models', () => ({
    sequelize: {
        transaction: (func) => func('MOCK_TRANSACTION')
    },
    audit_log: {
        create: jest.fn()
    }
}));

describe('Audit', () => {
    test('should create an audit record', async() => {
        const currentUser = 'test username';
        const requestWithValidDataForAudit = httpMocks.createRequest({
            method: 'POST',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {log: 'Logged Out'},
            nickname: currentUser
        });

        const response = httpMocks.createResponse();
        await audit(requestWithValidDataForAudit, response, () => {});

        const expectedLog = {
            action: `Logged Out`,
            caseId: null,
            user: currentUser
        };
        expect(models.audit_log.create)
            .toHaveBeenCalledWith(expectedLog);

        expect(response.statusCode).toEqual(201)
    });
});