import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import CaseNote from "../../../testHelpers/caseNote";
import { isCaseNoteAuthor } from "./isCaseNoteAuthor";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("isCaseNoteAuthor", () => {
  const CASE_NOTE_AUTHOR = "will smith";
  let caseNoteAction, createdCase, createdCaseNote;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    caseNoteAction = await models.case_note_action.create(
      { name: "some action" },
      { auditUser: CASE_NOTE_AUTHOR }
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
      auditUser: CASE_NOTE_AUTHOR
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser(CASE_NOTE_AUTHOR)
      .withCaseId(createdCase.id)
      .withNotes("default notes")
      .withCaseNoteActionId(caseNoteAction.id)
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: CASE_NOTE_AUTHOR
    });
  });
  test("should return true if case note was created by user", async () => {
    expect(
      await isCaseNoteAuthor(CASE_NOTE_AUTHOR, createdCaseNote.id)
    ).toBeTrue();
  });

  test("should return false if case note was created by another user", async () => {
    expect(
      await isCaseNoteAuthor("random dude", createdCaseNote.id)
    ).toBeFalse();
  });

  test("should throw an error if case note does not exist", async () => {
    let nonExistentCaseNoteId = createdCaseNote.id + 1;
    await expect(
      isCaseNoteAuthor(CASE_NOTE_AUTHOR, nonExistentCaseNoteId)
    ).rejects.toThrowError(new Error("Case note does not exist."));
  });
});
