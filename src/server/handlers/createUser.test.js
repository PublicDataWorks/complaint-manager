const createUser = require("./createUser");
const httpMocks = require("node-mocks-http");
const models = require('../models')
const generatePassword = require('password-generator');

jest.mock('../models', () => ({
    users: {
        create: jest.fn()
    }
}))

jest.mock('password-generator', () => jest.fn(() => "TEST_PASSWORD"))


describe('create user', () => {
    let request, response

    beforeEach(() => {
        request = httpMocks.createRequest({
            method: 'POST',
            body: {
                firstName: "First",
                lastName: "Last",
                email: "blah@mail.org"
            }
        })

        response = httpMocks.createResponse()

        const createdUser = {
            someUserProp: "some value",
            password: "SUPER_SECRET_PASSWORD"
        };
        models.users.create.mockImplementation(() => {
            return Promise.resolve(createdUser)
        })
    })

    test('should create user with generated password', async () => {
        await createUser(request, response)

        expect(models.users.create).toHaveBeenCalledWith({
            firstName: 'First',
            lastName: 'Last',
            email: "blah@mail.org",
            password: "TEST_PASSWORD"
        })
    })

    test('should generate a 12 character password', async () => {
        await createUser(request, response)

        expect(generatePassword).toHaveBeenCalledWith(12)
    })

    test('should respond with 201 code', async () => {
        await createUser(request, response)

        expect(response.statusCode).toEqual(201)
    })

    test('should respond with 500 when create user fails', async () => {
        const next = jest.fn()
        const error = new Error('DB Down!')

        models.users.create.mockImplementation(() => Promise.reject(error))

        await createUser(request, response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
