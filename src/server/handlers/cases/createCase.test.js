const httpMocks = require("node-mocks-http");
const createCase = require("./createCase");
const models = require("../../models");

describe("createCase handler", () => {
  let request, response, next, caseAttributes, civilianAttributes;

  beforeEach(() => {
    caseAttributes = {
      complainantType: "Civilian",
      firstContactDate: "2018-02-08",
      incidentDate: "2018-03-16",
      createdBy: "someone",
      assignedTo: "someone"
    };
    civilianAttributes = {
      firstName: "First",
      lastName: "Last",
      phoneNumber: "1234567890"
    };

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        case: caseAttributes,
        civilian: civilianAttributes
      },
      nickname: "TEST_USER_NICKNAME"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should create case in database", async () => {
    await createCase(request, response, next);
    const createdCase = (await models.cases.findAll({
      include: [{ model: models.civilian }]
    }))[0];
    expect(createdCase.dataValues).toEqual(
      expect.objectContaining(caseAttributes)
    );
    expect(createdCase.dataValues.civilians[0]).toEqual(
      expect.objectContaining(civilianAttributes)
    );
  });

  test("should send response and 201 status with created entity", async () => {
    await createCase(request, response, next);

    response.on("send", () => {
      expect(response.statusCode).toEqual(201);
      expect(response._getData()).toEqual(
        expect.objectContaining({
          ...caseAttributes,
          civilians: expect.arrayContaining([
            expect.objectContaining({
              ...civilianAttributes
            })
          ])
        })
      );
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
});
