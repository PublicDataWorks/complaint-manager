const httpMocks = require("node-mocks-http");
const createCase = require("./createCase");
const models = require("../../models");

describe("createCase handler", () => {
  let request, response, next, caseAttributes, civilianAttributes;

  beforeEach(async () => {
    await models.cases.destroy({ truncate: true, cascade: true });

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

  afterEach(async () => {
    await models.cases.destroy({ truncate: true, cascade: true });
  });

  test("should create case with civilian if civilian complainant type ", async () => {
    await createCase(request, response, next);

    const insertedCase = await models.cases.find({
      where: { complainantType: "Civilian" },
      include: [models.civilian]
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complainantType: "Civilian",
        firstContactDate: "2018-02-08",
        incidentDate: "2018-03-16",
        civilians: expect.arrayContaining([
          expect.objectContaining({
            firstName: "First",
            lastName: "Last",
            phoneNumber: "1234567890"
          })
        ])
      })
    );
  });

  test("should create case without civilian model if officer complainant", async () => {
    const policeOfficerRequest = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        case: {
          createdBy: "tuser",
          assignedTo: "tuser",
          complainantType: "Police Officer",
          firstContactDate: "2018-02-08",
          incidentDate: "2018-03-16T17:42"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await createCase(policeOfficerRequest, response, next);
    const insertedCase = await models.cases.find({
      where: { complainantType: "Police Officer" }
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complainantType: "Police Officer",
        firstContactDate: "2018-02-08",
        incidentDate: "2018-03-16"
      })
    );
    expect(insertedCase).not.toEqual(
      expect.objectContaining({
        civilians: expect.arrayContaining([expect.anything()])
      })
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
        case: {
          complainantType: "Civilian"
        },
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
        case: {
          complainantType: "Civilian"
        },
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
