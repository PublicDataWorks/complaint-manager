import {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";

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
      complaintType: CIVILIAN_INITIATED,
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
      where: { complaintType: CIVILIAN_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complaintType: CIVILIAN_INITIATED,
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
          complaintType: RANK_INITIATED,
          firstContactDate: "2018-02-08",
          incidentDate: "2018-03-16T17:42"
        }
      },
      nickname: user
    });

    await createCase(policeOfficerRequest, response, next);
    const insertedCase = await models.cases.find({
      where: { complaintType: RANK_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });

    expect(insertedCase).toEqual(
      expect.objectContaining({
        complaintType: RANK_INITIATED,
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
          complaintType: CIVILIAN_INITIATED
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
          complaintType: CIVILIAN_INITIATED
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

  describe("audit data access", () => {
    test("should audit when creating a case with an officer complainant", async () => {
      const policeOfficerRequest = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: {
          case: {
            complaintType: RANK_INITIATED,
            firstContactDate: "2018-02-08",
            incidentDate: "2018-03-16T17:42"
          }
        },
        nickname: user
      });

      await createCase(policeOfficerRequest, response, next);

      const cases = await models.cases.findAll({ returning: true });

      const audit = await models.action_audit.find({
        where: { caseId: cases[0].id }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: cases[0].id
        })
      );
    });

    test("should audit when creating a case with a civilian complainant", async () => {
      await createCase(request, response, next);

      const cases = await models.cases.findAll({ returning: true });

      const audit = await models.action_audit.find({
        where: { caseId: cases[0].id }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: cases[0].id
        })
      );
    });
  });
});
