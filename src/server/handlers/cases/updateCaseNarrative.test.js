import Case from "../../../client/testUtilities/case";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";

const httpMocks = require("node-mocks-http");
const models = require("../../models/index");
const updateCaseNarrative = require("./updateCaseNarrative");

describe("updateCaseNarrative handler", () => {
  let request, response, existingCase, userNickname;

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

    response = httpMocks.createResponse();
  });

  test("should update case", async () => {
    await updateCaseNarrative(request, response, jest.fn());

    await existingCase.reload();
    expect(existingCase.dataValues).toEqual(
      expect.objectContaining({
        narrativeSummary: "So much summary",
        narrativeDetails: "So much narrative"
      })
    );
  });

  test("should send a 200 response and updated case", async () => {
    await updateCaseNarrative(request, response, jest.fn());

    expect(response._getStatusCode()).toEqual(200);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        narrativeSummary: "So much summary",
        narrativeDetails: "So much narrative"
      })
    );
    expect(response._isEndCalled()).toBeTruthy();
  });

  test("should audit case details access when case narrative updated", async () => {
    await updateCaseNarrative(request, response, jest.fn());

    const actionAudit = await models.action_audit.find({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: userNickname,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DATA_ACCESSED
      })
    );
  });
});
