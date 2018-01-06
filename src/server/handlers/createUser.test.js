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

  beforeEach(async () => {
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

    await createUser(request, response)
  })

  test('should create user with generated password', () => {
    expect(models.users.create).toHaveBeenCalledWith({
      firstName: 'First',
      lastName: 'Last',
      email: "blah@mail.org",
      password: "TEST_PASSWORD"
    })
  })

  test('should generate a 12 character password', () => {
    expect(generatePassword).toHaveBeenCalledWith(12)
  })

  test('should respond with 201 code', () => {
    expect(response.statusCode).toEqual(201)
  })


  test('should respond with created user without password', () => {
    const createdUserWithoutPassword = {
      someUserProp: "some value"
    }
    expect(response._getData()).toEqual(createdUserWithoutPassword)
  })
})