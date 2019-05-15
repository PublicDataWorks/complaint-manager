import * as httpMocks from "node-mocks-http";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import CaseNote from "../../../../client/testUtilities/caseNote";
import removeCaseNote from "./removeCaseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  AUDIT_ACTION
} from "../../../../sharedUtilities/constants";
import mockLodash from "lodash";

jest.mock("../../getQueryAuditAccessDetails", () => ({
  generateAndAddAuditDetailsFromQuery: jest.fn(
    (existingDetails, queryOptions, topLevelModelName) => {
      existingDetails[mockLodash.camelCase(topLevelModelName)] = {
        attributes: ["mockDetails"]
      };
    }
  ),
  removeFromExistingAuditDetails: jest.fn()
}));

describe("RemoveCaseNote unit", () => {
  let createdCase, createdCaseNote;

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
  });

  test("should update case status and case notes in the db after case note removed", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    await removeCaseNote(request, response, jest.fn());

    const updatedCase = await models.cases.findAll({
      where: { id: createdCase.id }
    });

    expect(updatedCase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: CASE_STATUS.ACTIVE
        })
      ])
    );

    const updatedCaseNotes = await models.case_note.findAll({
      where: { caseId: updatedCase.id }
    });
    expect(updatedCaseNotes).toEqual([]);
  });

  test("should audit case details access when case note removed", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

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
          auditDetails: {
            Case: ["Is Archived", "Mock Details", "Pdf Available"]
          }
        })
      ])
    );
  });

  test("should audit case notes access when case note removed", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

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
          caseId: createdCase.id
        })
      ])
    );
  });
});
