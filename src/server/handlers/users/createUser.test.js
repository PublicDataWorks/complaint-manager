const createUser = require("./createUser");
const httpMocks = require("node-mocks-http");
const models = require('../../models/index')
const generatePassword = require('password-generator')
const transporter = require('../../email/transporter')

jest.mock('../../models', () => ({
    users: {
        create: jest.fn()
    }
}))

jest.mock('password-generator', () => jest.fn(() => "TEST_PASSWORD"))

jest.mock('../../email/transporter', () => ({
    sendMail: jest.fn()
}))


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
            email: "blah@mail.org",
            password: "SUPER_SECRET_PASSWORD"
        };

        models.users.create.mockImplementation(() => {
            return Promise.resolve(createdUser)
        })

       transporter.sendMail.mockReset()
    })

    test('should create user with generated password', async () => {
        transporter.sendMail.mockImplementation(() => Promise.resolve({accepted: '', response: '', rejected: ''}))
        await createUser(request, response)

        expect(models.users.create).toHaveBeenCalledWith({
            firstName: 'First',
            lastName: 'Last',
            email: "blah@mail.org",
            password: "TEST_PASSWORD"
        })
    })

    test('should generate a 12 character password', async () => {
        transporter.sendMail.mockImplementation(() => Promise.resolve({accepted: '', response: '', rejected: ''}))

        await createUser(request, response)

        expect(generatePassword).toHaveBeenCalledWith(12)
    })

    test('should respond with 201 code', async () => {
        transporter.sendMail.mockImplementation(() => Promise.resolve({accepted: '', response: '', rejected: ''}))
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

    test('should invoke send email when user is successfully created', async () => {
        transporter.sendMail.mockImplementation(() => Promise.resolve({accepted: '', response: '', rejected: ''}))


        const message = {
            from: 'test_env_email@example.com',
            to: 'blah@mail.org',
            subject: 'Your NOIPM Password',
            text: "SUPER_SECRET_PASSWORD"
        };

        await createUser(request, response)

        expect(transporter.sendMail).toHaveBeenCalledWith(message)
    })

    test('should not send email if create user fails', async () => {
        const next = jest.fn()
        const error = new Error('User was not created')
        models.users.create.mockImplementation(() => Promise.reject(error))

        await createUser(request, response, next)

        expect(transporter.sendMail).toHaveBeenCalledTimes(0)
    })

    test('should respond with 500 when when email send fails', async () => {
        const next = jest.fn()
        const error = new Error('Email was not sent')
        transporter.sendMail.mockImplementation(() => Promise.reject(error))

        await createUser(request, response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
