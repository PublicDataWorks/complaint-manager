const httpMocks = require("node-mocks-http")
const exportAuditLogs = require('./export')
const models = require('../../models')

jest.mock('../../models', () => ({
    audit_log: {
        findAll: jest.fn()
    }
}))

describe('audit log export', function () {
    test('should call next when error received from db', async () => {
        models.audit_log.findAll.mockImplementation(() => Promise.reject())
        const request = httpMocks.createRequest({
            method: 'GET'
        })
        const response = httpMocks.createResponse()
        const next = jest.fn()
        await exportAuditLogs(request, response, next)

        expect(next).toHaveBeenCalled()
    })
});