import * as httpMocks from "node-mocks-http";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import CaseNote from "../../../../client/testUtilities/caseNote";
import removeCaseNote from "./removeCaseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS
} from "../../../../sharedUtilities/constants";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  expectedCaseAuditDetails,
  expectedFormattedCaseAuditDetails
} from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../audits/auditDataAccess");

describe("RemoveCaseNote unit", () => {
  let createdCase, createdCaseNote, request;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
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
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      fflip: mockFflipObject({ newAuditFeature: false }),
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      nickname: "TEST_USER_NICKNAME"
    });
  });

  test("should update case status and case notes in the db after case note removed", async () => {
    const response = httpMocks.createResponse();
    await removeCaseNote(request, response, jest.fn());

    const updatedCase = await models.cases.findOne({
      where: { id: createdCase.id }
    });

    expect(updatedCase).toEqual(
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE
      })
    );

    const updatedCaseNotes = await models.case_note.findAll({
      where: { caseId: createdCase.id }
    });
    expect(updatedCaseNotes).toEqual([]);
  });

  describe("newAuditFeature disabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });
    });

    test("should audit case notes access when case note removed", async () => {
      const response = httpMocks.createResponse();
      await removeCaseNote(request, response, jest.fn());

      const actionAudit = await models.action_audit.findAll({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_NOTES,
            caseId: createdCase.id,
            auditDetails: { "Case Note": ["All Case Note Data"] }
          })
        ])
      );
    });

    test("should audit case details access when case note removed", async () => {
      const response = httpMocks.createResponse();
      await removeCaseNote(request, response, jest.fn());

      const actionAudit = await models.action_audit.findAll({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            caseId: createdCase.id,
            auditDetails: expectedFormattedCaseAuditDetails
          })
        ])
      );
    });
  });

  describe("newAuditFeature enabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({
        newAuditFeature: true
      });
    });

    test("should audit case notes access when case note removed", async () => {
      const response = httpMocks.createResponse();
      await removeCaseNote(request, response, jest.fn());

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        AUDIT_SUBJECT.CASE_NOTES,
        {
          caseNote: {
            attributes: Object.keys(models.case_note.rawAttributes),
            model: models.case_note.name
          }
        },
        expect.anything()
      );
    });

    test("should audit case details access when case note removed", async () => {
      const response = httpMocks.createResponse();
      await removeCaseNote(request, response, jest.fn());

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
