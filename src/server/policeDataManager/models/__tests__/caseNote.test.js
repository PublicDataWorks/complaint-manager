import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseNote from "../../../testHelpers/caseNote";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../index";

describe("caseNote", () => {
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should not allow notes to be set to null", async () => {
    const notes = "these are the notes. end of notes";
    const c4se = await createTestCaseWithoutCivilian();
    const caseNote = await models.case_note.create(
      new CaseNote.Builder()
        .defaultCaseNote()
        .withNotes(notes)
        .withCaseId(c4se.id)
        .build(),
      { auditUser: "user" }
    );
    caseNote.notes = null;
    expect(caseNote.notes).toEqual(notes);
  });
});
