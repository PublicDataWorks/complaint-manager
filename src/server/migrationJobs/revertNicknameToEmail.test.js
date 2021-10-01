import models from "../policeDataManager/models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Case from "../../sharedTestHelpers/case";
import CaseNote from "../testHelpers/caseNote";
import revertNicknameToEmail from "./revertNicknameToEmail";

describe("transform nickname to email for production users", () => {
  let currentCase, currentCaseNote;
  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase();

    currentCase = await models.cases.create(caseAttributes, {
      auditUser: "tuser"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should transform case note with author scziment, lvillasanta, alowe, shutson to their corresponding @nolaipm.gov email", async () => {
    let caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("scziment@nolaipm.gov")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("lvillasanta@nolaipm.gov")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("shutson@nolaipm.gov")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("alowe@nolaipm.gov")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    let caseNotes = await models.case_note.findAll();

    await models.sequelize.transaction(async transaction => {
      await revertNicknameToEmail(caseNotes, transaction);
    });

    const transformedCaseNotes = await models.sequelize.query(
      "SELECT * FROM case_notes",
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCaseNotes[0].user).toEqual("scziment");
    expect(transformedCaseNotes[1].user).toEqual("lvillasanta");
    expect(transformedCaseNotes[2].user).toEqual("shutson");
    expect(transformedCaseNotes[3].user).toEqual("alowe");
  });

  test("should not transform case note with author veronica.blackwell@thoughtworks.com", async () => {
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("veronica.blackwell@thoughtworks.com")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    let caseNotes = await models.case_note.findAll();

    await models.sequelize.transaction(async transaction => {
      await revertNicknameToEmail(caseNotes, transaction);
    });

    const transformedCaseNotes = await models.sequelize.query(
      "SELECT * FROM case_notes",
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCaseNotes[0].user).toEqual(
      "veronica.blackwell@thoughtworks.com"
    );
  });
});
