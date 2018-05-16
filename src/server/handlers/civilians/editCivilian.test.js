const editCivilian = require("./editCivilian");
const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  sequelize: {
    transaction: func => func("MOCK_TRANSACTION")
  },
  audit_log: {
    create: jest.fn()
  },
  civilian: {
    update: jest.fn(),
    findAll: jest.fn()
  },
  cases: {
    update: jest.fn()
  },
  address: {
    update: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
  }
}));

describe("editCivilian handler", () => {
  test("should update civilian with correct properties", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: 1
      },
      body: {
        firstName: "mock name"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());

    const options = {
      where: { id: request.params.id },
      transaction: "MOCK_TRANSACTION",
      returning: true
    };

    expect(models.civilian.update).toHaveBeenCalledWith(request.body, options);
  });

  test("should create audit log after successful civilian update", async () => {
    models.civilian.update.mockImplementation(() => {
      return Promise.resolve([1, [{ dataValues: { id: 1, caseId: 2 } }]]);
    });

    models.cases.update.mockImplementation(() => {
      return Promise.resolve();
    });

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: 1
      },
      body: {
        firstName: "mock name"
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());
    const expectedLog = {
      action: `Civilian updated`,
      caseId: 2,
      user: "TEST_USER_NICKNAME"
    };
    expect(models.audit_log.create).toHaveBeenCalledWith(expectedLog, {
      transaction: "MOCK_TRANSACTION"
    });
  });

  test("should call next when civilian edit fails", async () => {
    const error = new Error("DB Down!");

    models.civilian.update.mockImplementation(() => Promise.reject(error));

    const request = httpMocks.createRequest({
      method: "PUT",
      body: {
        civilian: {
          firstName: "Valid",
          lastName: "Name"
        }
      }
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
