const httpMocks = require("node-mocks-http");
const createCase = require("./createCase");
const models = require("../../models");
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

describe("createCase handler", () => {
  let request, response, next, caseAttributes, civilianAttributes, user;

  beforeEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });

    user = "TEST_USER_NICKNAME";
    caseAttributes = {
      complainantType: "Civilian",
      firstContactDate: "2018-02-08",
      incidentDate: "2018-03-16"
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
      nickname: user
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create case with civilian if civilian complainant type ", async () => {
    await createCase(request, response, next);

    const insertedCase = await models.cases.find({
      where: { complainantType: "Civilian" },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complainantType: "Civilian",
        firstContactDate: "2018-02-08",
        incidentDate: "2018-03-16",
        createdBy: user,
        assignedTo: user,
        complainantCivilians: expect.arrayContaining([
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
          complainantType: "Police Officer",
          firstContactDate: "2018-02-08",
          incidentDate: "2018-03-16T17:42"
        }
      },
      nickname: user
    });

    await createCase(policeOfficerRequest, response, next);
    const insertedCase = await models.cases.find({
      where: { complainantType: "Police Officer" },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complainantType: "Police Officer",
        firstContactDate: "2018-02-08",
        incidentDate: "2018-03-16",
        createdBy: user,
        assignedTo: user,
        complainantCivilians: []
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
          createdBy: user,
          assignedTo: user,
          complainantCivilians: expect.arrayContaining([
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
      },
      nickname: user
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
      },
      nickname: user
    });

    await createCase(request, response, next);

    expect(response.statusCode).toEqual(400);
  });
});
