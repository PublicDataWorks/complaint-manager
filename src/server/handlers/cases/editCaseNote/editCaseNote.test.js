import * as httpMocks from "node-mocks-http";
import CaseNote from "../../../../client/testUtilities/caseNote";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import editCaseNote from "./editCaseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  AUDIT_ACTION
} from "../../../../sharedUtilities/constants";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../auditDataAccess";
import { generateAndAddAuditDetailsFromQuery } from "../../getQueryAuditAccessDetails";

//mocked implementation in "/handlers/__mocks__/getQueryAuditAccessDetails"
jest.mock("../../getQueryAuditAccessDetails");
jest.mock("../../auditDataAccess");

describe("editCaseNote", function() {
  let createdCase,
    createdCaseNote,
    updatedCaseNote,
    caseNoteAction,
    newCaseNoteAction;
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    caseNoteAction = await models.case_note_action.create(
      { name: "some action" },
      { auditUser: "some user" }
    );
    newCaseNoteAction = await models.case_note_action.create(
      { name: "updated action" },
      { auditUser: "a different user" }
    );
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(createdCase.id)
      .withNotes("default notes")
      .withCaseNoteActionId(caseNoteAction.id)
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    updatedCaseNote = {
      caseNoteActionId: newCaseNoteAction.id,
      notes: "updated notes"
    };
  });

  test("should update case status and case notes in the db after case note edited", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      body: updatedCaseNote,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    await editCaseNote(request, response, jest.fn());

    const updatedCase = await models.cases.findOne({
      where: { id: createdCase.id }
    });

    expect(updatedCase).toEqual(
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE
      })
    );

    const updatedCaseNotes = await models.case_note.findAll({
      where: { caseId: createdCase.id },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }]
    });
    expect(updatedCaseNotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdCaseNote.id,
          caseId: createdCaseNote.caseId,
          notes: updatedCaseNote.notes,
          caseNoteActionId: updatedCaseNote.caseNoteActionId,
          caseNoteAction: expect.objectContaining({
            id: newCaseNoteAction.id,
            name: newCaseNoteAction.name
          })
        })
      ])
    );
  });

  describe("newAuditFeature enabled", () => {
    let request, response, next;
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        fflip: mockFflipObject({ newAuditFeature: true }),
        params: {
          caseId: createdCase.id,
          caseNoteId: createdCaseNote.id
        },
        body: updatedCaseNote,
        nickname: "TEST_USER_NICKNAME"
      });
      response = httpMocks.createResponse();
      next = jest.fn();
    });

    test("should call generateAndAddAuditDetailsFromQuery with correct arguments", async () => {
      /*
       jest seems to use passed by reference value when asserting
       on function inputs. Since we mutate the value of audit details in
       this function but we want to assert against the original inputs,
       we decided to make the mock implementation do nothing.

       see: https://github.com/facebook/jest/issues/4715
       */
      generateAndAddAuditDetailsFromQuery.mockImplementationOnce(jest.fn());

      await editCaseNote(request, response, next);

      expect(generateAndAddAuditDetailsFromQuery).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          auditUser: request.nickname
        }),
        models.case_note.name
      );
    });

    test("should audit when case note accessed through edit", async () => {
      await editCaseNote(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        AUDIT_SUBJECT.CASE_NOTES,
        {
          caseNote: {
            attributes: ["mockDetails"],
            model: models.case_note.name
          }
        },
        expect.anything()
      );
    });
  });

  describe("newAuditFeature disabled", () => {
    test("should audit when case note accessed through edit", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        fflip: mockFflipObject({ newAuditFeature: false }),
        params: {
          caseId: createdCase.id,
          caseNoteId: createdCaseNote.id
        },
        body: updatedCaseNote,
        nickname: "TEST_USER_NICKNAME"
      });

      const response = httpMocks.createResponse();
      const next = jest.fn();
      await editCaseNote(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: "TEST_USER_NICKNAME",
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_NOTES,
          caseId: createdCase.id
        })
      );
    });
  });
});
