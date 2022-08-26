import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseNote from "../../../testHelpers/caseNote";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../index";

describe("caseNote", () => {
  beforeEach(async () => {
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
