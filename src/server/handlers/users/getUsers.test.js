const httpMocks = require('node-mocks-http')
const getUsers = require('./getUsers')
const models = require('../../models/index')

jest.mock('../../models', () => ({
    users: {
        findAll: jest.fn()
    }
}))

describe('getUsers handler', () => {
    let request, response

    beforeEach(()=>{
        request = httpMocks.createRequest({
            method: 'GET'
        })
        response = httpMocks.createResponse()
    })

    test('should successfully respond with all users in the database', async () => {
        const allUsers = 'all users'
        models.users.findAll.mockImplementation(() =>
            Promise.resolve(allUsers)
        )

        await getUsers(request, response)

        expect(response.statusCode).toEqual(200)
        expect(response._getData()).toEqual({
            users: allUsers
        })
    })

    test.skip('should respond with 500 when cannot get all users', () => {

    })

})