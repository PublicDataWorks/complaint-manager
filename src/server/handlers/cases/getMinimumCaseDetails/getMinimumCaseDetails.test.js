import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import {
  AUDIT_SUBJECT,
  CIVILIAN_INITIATED,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import models from "../../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import getMinimumCaseDetails from "./getMinimumCaseDetails";
import auditDataAccess from "../../audits/auditDataAccess";

jest.mock("../../audits/auditDataAccess");

describe("getMinimumCaseDetails", () => {
  let response, next, request, existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(205)
      .withFirstContactDate("2017-12-25")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: "nickname"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("gets case reference", async () => {
    await getMinimumCaseDetails(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseReference).toEqual("CC2017-0001");
  });

  test("gets minimum case details for archived case", async () => {
    await existingCase.destroy({ auditUser: "test" });
    await getMinimumCaseDetails(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseReference).toEqual("CC2017-0001");
  });
  describe("auditing", () => {
    test("audits the data access", async () => {
      await getMinimumCaseDetails(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        {
          cases: {
            attributes: ["caseReference", "statusId"],
            model: models.cases.name
          }
        },
        expect.anything()
      );
    });
  });
});
