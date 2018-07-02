import * as httpMocks from "node-mocks-http";
import CaseNote from "../../../../client/testUtilities/caseNote";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import editCaseNote from "./editCaseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

afterEach(async () => {
  await cleanupDatabase();
});

test("should update case status and recent activity in the db after case note edited", async () => {
  const caseToCreate = new Case.Builder()
    .defaultCase()
    .withId(undefined)
    .withStatus(CASE_STATUS.INITIAL)
    .withComplainantCivilians([])
    .withAttachments([])
    .withAccusedOfficers([])
    .withIncidentLocation(undefined)
    .build();

  const createdCase = await models.cases.create(caseToCreate, {
    auditUser: "someone"
  });

  const caseNoteToCreate = new CaseNote.Builder()
    .defaultCaseNote()
    .withCaseId(createdCase.id)
    .withNotes("default notes")
    .withAction("Memo to file")
    .build();

  const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
    auditUser: "someone"
  });

  const updatedCaseNote = {
    action: "Miscellaneous",
    notes: "updated notes"
  };

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

  const updatedCase = await models.cases.find({
    where: { id: createdCase.id }
  });

  expect(updatedCase).toEqual(
    expect.objectContaining({
      status: CASE_STATUS.ACTIVE
    })
  );

  const updatedRecentActivity = await models.case_note.findAll({
    where: { caseId: createdCase.id }
  });
  expect(updatedRecentActivity).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: createdCaseNote.id,
        caseId: createdCaseNote.caseId,
        notes: updatedCaseNote.notes,
        action: updatedCaseNote.action
      })
    ])
  );
});
