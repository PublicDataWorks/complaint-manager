import {
  ADDRESSABLE_TYPE,
  ASCENDING,
  AUDIT_SUBJECT,
  CIVILIAN_INITIATED,
  MANAGER_TYPE,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Boom from "boom";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../audits/auditDataAccess";

const httpMocks = require("node-mocks-http");
const createCase = require("./createCase");
const models = require("../../policeDataManager/models");

jest.mock("../audits/auditDataAccess");

describe("createCase handler", () => {
  let request, response, next, caseAttributes, civilianAttributes, user;

  beforeEach(async () => {
    user = "TEST_USER_NICKNAME";
    caseAttributes = {
      complaintType: CIVILIAN_INITIATED,
      firstContactDate: "2018-02-08",
      incidentDate: "2018-03-16"
    };
    civilianAttributes = {
      firstName: "First",
      lastName: "Last",
      phoneNumber: "1234567890",
      address: {
        streetAddress: "Some Address",
        intersection: "",
        streetAddress2: "Some Address Pt 2",
        city: "Somewhere",
        state: "No",
        zipCode: "00000",
        country: "Nowhere",
        lat: 0.0,
        lng: 0.0,
        placeId: "WhoaLookAtThisPlaceId",
        additionalLocationInfo: null
      }
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

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should create case with civilian address information", async () => {
    await createCase(request, response, next);

    const insertedCase = await models.cases.findOne({
      where: { complaintType: CIVILIAN_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });
    const insertedAddress = await models.address.findOne({
      where: { addressableId: insertedCase.primaryComplainant.id }
    });

    expect(insertedAddress).toEqual(
      expect.objectContaining({
        ...civilianAttributes.address,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN
      })
    );
  });
  test("should create case with civilian if civilian complainant type ", async () => {
    await createCase(request, response, next);

    const insertedCase = await models.cases.findOne({
      where: { complaintType: CIVILIAN_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });
    expect(insertedCase).toEqual(
      expect.objectContaining({
        year: 2018,
        caseNumber: 1,
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
    const insertedCase = await models.cases.findOne({
      where: { complaintType: RANK_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });
    expect(insertedCase).toEqual(
      expect.objectContaining({
        year: 2018,
        caseNumber: 1,
        complaintType: RANK_INITIATED,
        firstContactDate: "2018-02-08",
        incidentDate: "2018-03-16",
        createdBy: user,
        assignedTo: user,
        complainantCivilians: []
      })
    );
  });

  test("should create case without civilian model if civilian within PD complainant", async () => {
    const civilianWithinPd = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        case: {
          complaintType: CIVILIAN_WITHIN_PD_INITIATED,
          firstContactDate: "2018-02-08",
          incidentDate: "2018-03-16T17:42"
        }
      },
      nickname: user
    });

    await createCase(civilianWithinPd, response, next);
    const insertedCase = await models.cases.findOne({
      where: { complaintType: CIVILIAN_WITHIN_PD_INITIATED },
      include: [{ model: models.civilian, as: "complainantCivilians" }]
    });
    expect(insertedCase).toEqual(
      expect.objectContaining({
        year: 2018,
        caseNumber: 1,
        complaintType: CIVILIAN_WITHIN_PD_INITIATED,
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
          complainantType: CIVILIAN_INITIATED,
          complainantType: CIVILIAN_INITIATED
        },
        civilian: {
          firstName: "",
          lastName: ""
        }
      },
      nickname: user
    });

    await createCase(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CIVILIAN_NAME)
    );
  });

  test("should respond with 400 when name input is more than 25 characters", async () => {
    request = httpMocks.createRequest({
      method: "POST",
      body: {
        case: {
          complainantType: CIVILIAN_INITIATED,
          complainantType: CIVILIAN_INITIATED
        },
        civilian: {
          firstName: "someveryveryveryveryveryveryveryveryveryveryverylongname",
          lastName: "name"
        }
      },
      nickname: user
    });

    await createCase(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CIVILIAN_NAME)
    );
  });

  describe("auditing", () => {
    test("should audit when creating a case with an officer complainant", async () => {
      const policeOfficerRequest = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: {
          case: {
            complaintType: RANK_INITIATED,
            complainantType: RANK_INITIATED,
            firstContactDate: "2018-02-08",
            incidentDate: "2018-03-16T17:42"
          }
        },
        nickname: user
      });

      await createCase(policeOfficerRequest, response, next);

      const cases = await models.cases.findAll({ returning: true });

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        cases[0].id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        {
          cases: {
            attributes: Object.keys(models.cases.rawAttributes),
            model: models.cases.name
          }
        },
        expect.anything()
      );
    });

    test("should audit when creating a case with a civilian complainant", async () => {
      await createCase(request, response, next);

      const cases = await models.cases.findAll({ returning: true });

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        cases[0].id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        {
          address: {
            attributes: Object.keys(models.address.rawAttributes),
            model: models.address.name
          },
          cases: {
            attributes: Object.keys(models.cases.rawAttributes),
            model: models.cases.name
          },
          complainantCivilians: {
            attributes: Object.keys(models.civilian.rawAttributes),
            model: models.civilian.name
          }
        },
        expect.anything()
      );
    });
  });

  describe("case number and case year (case reference generation)", () => {
    test("assigns the next case number for this year when other cases exist", async () => {
      await createCaseForYear(2017); //case 2017-0001
      await createCaseForYear(2018); //case 2018-0001
      await createCaseForYear(2018); //case 2018-0002
      await createCase(request, response, next); //case 2018-0003
      const insertedCases = await models.cases.findAll({
        order: [["created_at", ASCENDING]]
      });
      expect(
        insertedCases.map(insertedCase => [
          insertedCase.year,
          insertedCase.caseNumber
        ])
      ).toEqual([
        [2017, 1],
        [2018, 1],
        [2018, 2],
        [2018, 3]
      ]);
    });

    test("assigns the case number of 1 for this year when no cases for this year exist yet", async () => {
      await createCase(request, response, next);
      const insertedCase = await models.cases.findOne();
      expect(insertedCase.year).toEqual(2018);
      expect(insertedCase.caseNumber).toEqual(1);
    });

    test("overrides any case number or year given as params", async () => {
      request.body.case.year = 1900;
      request.body.case.caseNumber = 5;
      await createCase(request, response, next);
      const insertedCase = await models.cases.findOne();
      expect(insertedCase.year).toEqual(2018);
      expect(insertedCase.caseNumber).toEqual(1);
    });

    test("throws error if error is other than unique case number error", async () => {
      request.body.case.firstContactDate = null;
      await createCase(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "SequelizeValidationError",
          errors: [expect.objectContaining({ type: "notNull Violation" })]
        })
      );
    });

    test("handles multiple cases trying to be created at once, and returns data for all", async () => {
      const request2 = httpMocks.createRequest({
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
      const response2 = httpMocks.createResponse();
      const next2 = jest.fn();

      const request3 = httpMocks.createRequest({
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
      const response3 = httpMocks.createResponse();
      const next3 = jest.fn();

      const promise1 = createCase(request, response, next);
      const promise2 = createCase(request2, response2, next2);
      const promise3 = createCase(request3, response3, next3);

      await Promise.all([promise1, promise2, promise3]);

      expect(response._getData().id).not.toBeUndefined();
      expect(response._getData().caseNumber).not.toBeUndefined();
      expect(response2._getData().id).not.toBeUndefined();
      expect(response2._getData().caseNumber).not.toBeUndefined();
      expect(response3._getData().id).not.toBeUndefined();
      expect(response3._getData().caseNumber).not.toBeUndefined();

      const insertedCases = await models.cases.findAll({
        order: [["created_at", ASCENDING]]
      });
      expect(
        insertedCases.map(insertedCase => [
          insertedCase.year,
          insertedCase.caseNumber
        ])
      ).toEqual([
        [2018, 1],
        [2018, 2],
        [2018, 3]
      ]);
    });
  });

  const createCaseForYear = async year => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withFirstContactDate(`${year}-01-02`)
      .withId(null)
      .build();
    await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });
  };
});
