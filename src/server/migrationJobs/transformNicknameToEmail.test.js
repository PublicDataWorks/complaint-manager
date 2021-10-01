import models from "../policeDataManager/models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Case from "../../sharedTestHelpers/case";
import CaseNote from "../testHelpers/caseNote";
import transformNicknameToEmail from "./transformNicknameToEmail";

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
      .withUser("scziment")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("lvillasanta")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("shutson")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("alowe")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    let caseNotes = await models.case_note.findAll();

    await models.sequelize.transaction(async transaction => {
      await transformNicknameToEmail(caseNotes, transaction);
    });

    const transformedCaseNotes = await models.sequelize.query(
      "SELECT * FROM case_notes",
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCaseNotes[0].user).toEqual("scziment@nolaipm.gov");
    expect(transformedCaseNotes[1].user).toEqual("lvillasanta@nolaipm.gov");
    expect(transformedCaseNotes[2].user).toEqual("shutson@nolaipm.gov");
    expect(transformedCaseNotes[3].user).toEqual("alowe@nolaipm.gov");
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
      await transformNicknameToEmail(caseNotes, transaction);
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
