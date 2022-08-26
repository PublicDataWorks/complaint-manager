import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Officer from "../../../../sharedTestHelpers/Officer";
import models from "../../../policeDataManager/models/index";
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";

const { cleanupDatabase } = require("../../../testHelpers/requestTestHelpers");
const httpMocks = require("node-mocks-http");
const searchOfficers = require("./searchOfficers");
const {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
} = require("../../../../sharedUtilities/constants");

jest.mock("../../audits/auditDataAccess");

describe("searchOfficers", function () {
  let existingCase, response, next, request;

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    existingCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    response = httpMocks.createResponse();
    next = jest.fn();

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      query: {
        firstName: "Sal",
        caseId: existingCase.id,
        page: 2
      },
      nickname: "nickname"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("auditing", () => {
    test("should audit when retrieving a case", async () => {
      await searchOfficers(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.OFFICER_DATA,
        {
          officerDistrict: {
            attributes: Object.keys(models.district.rawAttributes),
            model: models.district.name
          },
          officer: {
            attributes: Object.keys(models.officer.rawAttributes),
            model: models.officer.name
          }
        },
        expect.anything()
      );
    });
  });

  test("should handle pagination", async () => {
    const totalOfficers = DEFAULT_PAGINATION_LIMIT + 1;
    const officers = [];
    for (let x = 1; x <= totalOfficers; x++) {
      officers.push(
        new Officer.Builder()
          .withOfficerNumber(x)
          .withFirstName("Sal")
          .withLastName("Foo")
          .build()
      );
    }
    officers[officers.length - 1].lastName = "LAST";

    await models.officer.bulkCreate(officers);

    await searchOfficers(request, response, next);

    expect(response._getData().rows.length).toEqual(1);
    expect(response._getData().rows).toEqual([
      expect.objectContaining({
        lastName: `LAST`
      })
    ]);
  });
});
