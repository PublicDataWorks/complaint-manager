import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";

const httpMocks = require("node-mocks-http");
const models = require("../../policeDataManager/models/index");
const updateCaseNarrative = require("./updateCaseNarrative");

jest.mock("../audits/auditDataAccess");

describe("updateCaseNarrative handler", () => {
  let request, response, existingCase, userNickname, next;

  afterEach(async () => {
    auditDataAccess.mockClear();
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    existingCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    response = httpMocks.createResponse();
    next = jest.fn();

    userNickname = "test_user";
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: {
        narrativeSummary: "So much summary",
        narrativeDetails: "So much narrative"
      },
      nickname: userNickname,
      permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
    });
  });

  test("should update case", async () => {
    await updateCaseNarrative(request, response, next);

    await existingCase.reload();
    expect(existingCase.dataValues).toEqual(
      expect.objectContaining({
        narrativeSummary: "So much summary",
        narrativeDetails: "So much narrative"
      })
    );
  });

  test("should send a 200 response and updated case", async () => {
    await updateCaseNarrative(request, response, next);

    expect(response._getStatusCode()).toEqual(200);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        narrativeSummary: "So much summary",
        narrativeDetails: "So much narrative"
      })
    );
    expect(response._isEndCalled()).toBeTruthy();
  });

  describe("auditing", () => {
    test("should audit case details access when case narrative updated", async () => {
      await updateCaseNarrative(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
