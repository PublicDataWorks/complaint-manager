const httpMocks = require('node-mocks-http');
const logout = require('./logout');
const models = require('../../models/index');

jest.mock('../../models', () => ({
    sequelize: {
        transaction: (func) => func('MOCK_TRANSACTION')
    },
    audit_log: {
        create: jest.fn()
    }
}));

describe('Logout', () => {
    test('should create an audit record', async() => {
        const currentUser = 'test username';
        const requestWithValidDataForAudit = httpMocks.createRequest({
            method: 'POST',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            nickname: currentUser
        });

        const response = httpMocks.createResponse();
        await logout(requestWithValidDataForAudit, response, () => {});

        const expectedLog = {
            action: `Logged Out`,
            caseId: null,
            user: currentUser
        };
        expect(models.audit_log.create)
            .toHaveBeenCalledWith(expectedLog, {transaction: 'MOCK_TRANSACTION'});

        expect(response.statusCode).toEqual(201)
    });
});