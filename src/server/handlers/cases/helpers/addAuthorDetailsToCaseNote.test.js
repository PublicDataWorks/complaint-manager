import { userService } from "../../../../auth";
import { addAuthorDetailsToCaseNote } from "./addAuthorDetailsToCaseNote";
import CaseNote from "../../../testHelpers/caseNote";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
const models = require("../../../policeDataManager/models");

jest.mock("../../../../auth", () => ({
  userService: {
    getUsers: jest.fn(() => {
      return [
        { name: "wancheny", email: "wancheny@gmail.com" },
        { name: "random", email: "random@gmail.com" },
        { name: "johnsmith", email: "johnsmith@gmail.com" },
        { name: "catpower", email: "catpower@gmail.com" }
      ];
    })
  }
}));

describe("addAuthorDetailsToCaseNote", () => {
  let rawCaseNotes, existingCase;

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    existingCase = await createTestCaseWithCivilian();

    const caseNoteAttributes1 = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(existingCase.id)
      .withUser("wancheny@gmail.com");
    await models.case_note.create(caseNoteAttributes1, { auditUser: "tuser" });

    const caseNoteAttributes2 = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(existingCase.id)
      .withUser("removedFromAuth0@gmail.com");
    await models.case_note.create(caseNoteAttributes2, { auditUser: "tuser" });

    rawCaseNotes = await models.case_note.findAll({
      where: {
        caseId: existingCase.id
      }
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("when user details are returned from auth0, user should receive case note with email and name", async () => {
    const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

    expect(caseNotes[0].author.name).toEqual("wancheny");
    expect(caseNotes[0].author.email).toEqual("wancheny@gmail.com");
  });

  test("when user details are not returned from auth0, user should receive case note with only email", async () => {
    const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

    expect(caseNotes[1].author.name).toEqual("");
    expect(caseNotes[1].author.email).toEqual("removedFromAuth0@gmail.com");
  });

  test("should call getUsers when getting notifications", async () => {
    await addAuthorDetailsToCaseNote(rawCaseNotes);

    expect(userService.getUsers).toHaveBeenCalled();
  });
});
