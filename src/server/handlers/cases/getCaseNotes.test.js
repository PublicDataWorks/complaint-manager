import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
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
    await getCaseNotes(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        caseNoteAction: expect.objectContaining({
          id: caseNoteAction.id,
          name: caseNoteAction.name
        })
      })
    ]);
  });
  describe("auditing", () => {
    test("should audit accessing case notes", async () => {
      await getCaseNotes(request, response, next);

      const audit = await models.audit.findOne({
        where: {
          caseId: existingCase.id,
          auditAction: AUDIT_ACTION.DATA_ACCESSED
        },
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              {
                model: models.data_access_value,
                as: "dataAccessValues"
              }
            ]
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user: "tuser",
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          caseId: existingCase.id,
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.CASE_NOTES,
            dataAccessValues: expect.arrayContaining([
              expect.objectContaining({
                association: "caseNote",
                fields: expect.arrayContaining(
                  Object.keys(models.case_note.rawAttributes)
                )
              }),
              expect.objectContaining({
                association: "caseNoteAction",
                fields: expect.arrayContaining(
                  Object.keys(models.case_note_action.rawAttributes)
                )
              })
            ])
          })
        })
      );
    });
  });
});
