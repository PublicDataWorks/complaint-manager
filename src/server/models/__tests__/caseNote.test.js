import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import CaseNote from "../../../client/testUtilities/caseNote";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import models from "../../models";

describe("caseNote", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should update status when you create a case note", async () => {
    const initialCase = await createTestCaseWithoutCivilian();

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withId(undefined)
      .withCaseId(initialCase.id)
      .build();

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);

    await models.case_note.create(caseNoteToCreate, { auditUser: "someone" });

    await initialCase.reload();

    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });
});
