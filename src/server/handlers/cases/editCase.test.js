const httpMocks = require('node-mocks-http')
const models = require('../../models')
const editCase = require('./editCase')

jest.mock('../../models', () => ({
    sequelize: {
        transaction: (func) => func('MOCK_TRANSACTION')
    },
    cases: {
        update: jest.fn(),
        findById: jest.fn()
    },
    audit_log: {
        create: jest.fn()
    }
}))

describe('Edit Case', () => {
    let request, response, next;

    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            params: {id: 5},
            body: {
                firstContactDate: "2018-02-08",
                incidentTime: "17:42",
                incidentDateNew: "2018-03-16"
            },
            nickname: 'TEST_USER_NICKNAME'
        })
        response = httpMocks.createResponse()
        next = jest.fn()

    })


    test('should call edit case on database', () => {
        editCase(request, response, next)
        expect(models.cases.update).toHaveBeenCalledWith({
            incidentDateNew: request.body.incidentDateNew,
            incidentTime: request.body.incidentTime,
            firstContactDate: request.body.firstContactDate
        },
        {
            where: { id: 5 },
            individualHooks: true,
            transaction: 'MOCK_TRANSACTION'
        })
    });


    test('should create audit log for edit case', async () => {
        models.cases.update.mockImplementation(() => Promise.resolve({}))

        await editCase(request, response, next)

        const expectedLog = {
            action: `Incident details updated`,
            caseId: 5,
            user: 'TEST_USER_NICKNAME'
        }
        expect(models.audit_log.create).toHaveBeenCalledWith(
            expectedLog, {transaction: 'MOCK_TRANSACTION'}
        )
    });

    test('should send back case record on editing a case', async () => {
        const updatedCase = 'updated case'
        models.cases.update.mockImplementation(() => Promise.resolve())
        models.cases.findById.mockImplementation(() => Promise.resolve(updatedCase))
        models.audit_log.create.mockImplementation(() => Promise.resolve())

        await editCase(request, response, next)

        expect(response._getData()).toEqual(updatedCase)
    });

    test("should respond with 400 when required field (firstContactDate) is not provided", async () => {
        models.cases.update.mockClear();


        const requestWithoutFirstContactDate = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            params: {id: 5},
            body: {
                incidentTime: "17:42",
                incidentDateNew: "2018-03-16"
            },
            nickname: 'TEST_USER_NICKNAME'
        });

        await editCase(requestWithoutFirstContactDate, response, next)

        expect(response.statusCode).toEqual(400)
        expect(models.cases.update).not.toHaveBeenCalled()
    })

    test("should respond with 400 when firstContactDate is invalid date", async () => {
        models.cases.update.mockClear();

        const requestWithoutFirstContactDate = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            params: {id: 5},
            body: {
                firstContactDate: "",
                incidentTime: "17:42",
                incidentDateNew: "2018-03-16"
            },
            nickname: 'TEST_USER_NICKNAME'
        });

        await editCase(requestWithoutFirstContactDate, response, next)

        expect(response.statusCode).toEqual(400)
        expect(models.cases.update).not.toHaveBeenCalled()
    })

    test('should call next if error occurs on edit', async () => {
        const error = new Error('DB Down!')
        models.cases.update.mockImplementation(() => Promise.reject(error))

        await editCase(request, response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
});
