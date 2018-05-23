const httpMocks = require("node-mocks-http");
const createCase = require("./createCase");
const models = require("../../models");

jest.mock("../../models", () => ({
  cases: {
    create: jest.fn()
  },
  civilian: {
    create: jest.fn()
  }
}));

describe("createCase handler", () => {
  let request, response, next;

  beforeEach(() => {
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        case: {
          complainantType: "Civilian",
          firstContactDate: "2018-02-08",
          incidentDate: "2018-03-16T17:42"
        },
        civilian: {
          firstName: "First",
          lastName: "Last",
          phoneNumber: "1234567890"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should create case in database", () => {
    createCase(request, response, next);
    expect(models.cases.create).toHaveBeenCalledWith(
      {
        ...request.body.case,
        civilians: [request.body.civilian]
      },
      {
        include: [
          {
            model: models.civilian
          }
        ],
        auditUser: "TEST_USER_NICKNAME"
      }
    );
  });

  test("should send response and 201 status with created entity", async () => {
    const createdCase = "new created case";
    models.cases.create.mockImplementation(() => Promise.resolve(createdCase));

    await createCase(request, response, next);

    response.on("send", () => {
      expect(response.statusCode).toEqual(201);
      expect(response._getData()).toEqual(createdCase);
      expect(response._isEndCalled()).toBeTruthy();
    });
  });

  test("should respond with 400 when civilian names are empty", async () => {
    request = httpMocks.createRequest({
      method: "POST",
      body: {
        civilian: {
          firstName: "",
          lastName: ""
        }
      }
    });

    await createCase(request, response, next);

    expect(response.statusCode).toEqual(400);
  });

  test("should respond with 400 when name input is more than 25 characters", async () => {
    request = httpMocks.createRequest({
      method: "POST",
      body: {
        civilian: {
          firstName: "someveryveryveryveryveryveryveryveryveryveryverylongname",
          lastName: "name"
        }
      }
    });

    await createCase(request, response, next);

    expect(response.statusCode).toEqual(400);
  });

  test("should call next when case creation fails", async () => {
    const error = new Error("DB Down!");
    models.cases.create.mockImplementation(() => Promise.reject(error));

    request = httpMocks.createRequest({
      method: "POST",
      body: {
        civilian: {
          firstName: "Valid",
          lastName: "Name"
        }
      }
    });

    await createCase(request, response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
