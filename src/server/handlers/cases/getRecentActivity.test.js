import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED
} from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createCaseWithCivilian } from "../../testHelpers/modelMothers";
import getRecentActivity from "./getRecentActivity";
import CaseNote from "../../../client/testUtilities/caseNote";
const models = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getRecentActivity", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should audit accessing case notes", async () => {
    const existingCase = await createCaseWithCivilian();
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(existingCase.id);
    await models.case_note.create(caseNoteAttributes, {auditUser: "tuser"});

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      nickname: "tuser"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getRecentActivity(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "tuser",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        caseId: existingCase.id
      })
    );
  });
});
