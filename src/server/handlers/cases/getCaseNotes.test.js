import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import getCaseNotes from "./getCaseNotes";
import CaseNote from "../../../client/testUtilities/caseNote";

const models = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getCaseNotes", function() {
  let request, response, next, existingCase, caseNoteAction;

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
    caseNoteAction = await models.case_note_action.create(
      { name: "Some Action" },
      { auditUser: "Some User" }
    );
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(existingCase.id)
      .withCaseNoteActionId(caseNoteAction.id);
    await models.case_note.create(caseNoteAttributes, { auditUser: "tuser" });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { caseId: existingCase.id },
      nickname: "tuser"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return case notes with case note action", async () => {
    const caseNotes = await getCaseNotes(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        caseNoteAction: expect.objectContaining({
          id: caseNoteAction.id,
          name: caseNoteAction.name
        })
      })
    ]);
  });

  test("should audit accessing case notes", async () => {
    await getCaseNotes(request, response, next);

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "tuser",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        caseId: existingCase.id,
        auditDetails: {
          "Case Note": ["All Case Note Data"],
          "Case Note Action": ["All Case Note Action Data"]
        }
      })
    );
  });
});
