import Case from "../../../client/testUtilities/case";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import mockFflipObject from "../../testHelpers/mockFflipObject";
import {
  expectedCaseAuditDetails,
  expectedFormattedCaseAuditDetails
} from "../../testHelpers/expectedAuditDetails";

const httpMocks = require("node-mocks-http");
const models = require("../../models/index");
const updateCaseNarrative = require("./updateCaseNarrative");

jest.mock("../audits/auditDataAccess");

describe("updateCaseNarrative handler", () => {
  let request, response, existingCase, userNickname, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
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
      nickname: userNickname
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

  describe("newAuditFeature enabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({ newAuditFeature: true });
    });
    test("should audit case details access when case narrative updated", async () => {
      await updateCaseNarrative(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });

  describe("newAuditFeature disabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({ newAuditFeature: false });
    });
    test("should audit case details access when case narrative updated", async () => {
      await updateCaseNarrative(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId: existingCase.id }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: userNickname,
          caseId: existingCase.id,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditDetails: expectedFormattedCaseAuditDetails
        })
      );
    });
  });
});
