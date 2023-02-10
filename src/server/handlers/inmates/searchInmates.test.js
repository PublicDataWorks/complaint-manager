import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import Inmate from "../../../sharedTestHelpers/Inmate";
import models from "../../policeDataManager/models/index";
import auditDataAccess from "../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import httpMocks from "node-mocks-http";
import searchInmates from "./searchInmates";
import {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
} from "../../../sharedUtilities/constants";

jest.mock("../audits/auditDataAccess");

describe("searchInmates", function () {
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
      await searchInmates(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.INMATE_DATA,
        {
          inmate: {
            attributes: Object.keys(models.inmate.rawAttributes),
            model: models.inmate.name
          }
        },
        expect.anything()
      );
    });
  });

  test("should handle pagination", async () => {
    const totalInmates = DEFAULT_PAGINATION_LIMIT + 1;
    const inmates = [];
    for (let x = 1; x <= totalInmates; x++) {
      inmates.push(
        new Inmate.Builder()
          .withInmateId(x + "")
          .withFirstName("Sal")
          .withLastName("Foo")
          .build()
      );
    }
    inmates[inmates.length - 1].lastName = "LAST";

    await models.inmate.bulkCreate(inmates);

    await searchInmates(request, response, next);

    expect(response._getData().rows.length).toEqual(1);
    expect(response._getData().rows).toEqual([
      expect.objectContaining({
        lastName: `LAST`
      })
    ]);
  });
});
