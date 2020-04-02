import models from "../../../complaintManager/models";
import Case from "../../../../client/complaintManager/testUtilities/case";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import CaseNote from "../../../../client/complaintManager/testUtilities/caseNote";
import { caseNoteOperationsPermitted } from "./caseNoteOperationsPermitted";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("caseNoteOperationsPermitted", () => {
  const CASE_NOTE_OWNER = "will smith";
  let caseNoteAction, createdCase, createdCaseNote;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    caseNoteAction = await models.case_note_action.create(
      { name: "some action" },
      { auditUser: CASE_NOTE_OWNER }
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
      auditUser: CASE_NOTE_OWNER
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser(CASE_NOTE_OWNER)
      .withCaseId(createdCase.id)
      .withNotes("default notes")
      .withCaseNoteActionId(caseNoteAction.id)
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: CASE_NOTE_OWNER
    });
  });
  test("should return true if case note was created by user", async () => {
    expect(
      await caseNoteOperationsPermitted(CASE_NOTE_OWNER, createdCaseNote.id)
    ).toBeTrue();
  });

  test("should return false if case note was created by another user", async () => {
    expect(
      await caseNoteOperationsPermitted("random dude", createdCaseNote.id)
    ).toBeFalse();
  });

  test("should throw an error if case note does not exist", async () => {
    let nonExistentCaseNoteId = createdCaseNote.id + 1;
    await expect(
      caseNoteOperationsPermitted(CASE_NOTE_OWNER, nonExistentCaseNoteId)
    ).rejects.toThrowError(new Error("Case note does not exist."));
  });
});
