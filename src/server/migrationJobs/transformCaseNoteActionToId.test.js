import { createTestCaseWithoutCivilian } from "../testHelpers/modelMothers";
import CaseNote from "../../client/testUtilities/caseNote";
import models from "../models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import {
  revertTransformCaseNoteActionToId,
  transformCaseNoteActionToId
} from "./transformCaseNoteActionToId";

describe("transform case note action to ID", () => {
  const caseNoteActionProperties = {
    checkedStatus: {
      id: 1,
      name: "Checked status"
    },
    contactedNopd: {
      id: 2,
      name: "Contacted NOPD"
    },
    memoToFile: {
      id: 3,
      name: "Memo to file"
    },
    misc: {
      id: 4,
      name: "Miscellaneous"
    }
  };

  let caseNoteActions,
    testCaseNotes,
    caseNoteWithActionStringCheckedStatus,
    caseNoteWithActionStringContactedNopd,
    caseNoteWithActionIdMemoToFile,
    caseNoteWithActionIdMisc;

  const selectCaseNotesQuery = "SELECT * FROM case_notes;";

  const caseNoteActionPropertiesArray = Object.keys(
    caseNoteActionProperties
  ).map(function(caseNoteActionKey) {
    return caseNoteActionProperties[caseNoteActionKey];
  });

  beforeEach(async () => {
    await models.case_note_action.bulkCreate(caseNoteActionPropertiesArray, {
      auditUser: "test"
    });

    caseNoteActions = await models.case_note_action.findAll();

    const existingCase = await createTestCaseWithoutCivilian();

    caseNoteWithActionStringCheckedStatus = await models.case_note.create(
      new CaseNote.Builder()
        .defaultCaseNote()
        .withCaseId(existingCase.id)
        .withNotes(caseNoteActionProperties.checkedStatus.name),
      { auditUser: "testUser" }
    );

    caseNoteWithActionStringContactedNopd = await models.case_note.create(
      new CaseNote.Builder()
        .defaultCaseNote()
        .withCaseId(existingCase.id)
        .withNotes(caseNoteActionProperties.contactedNopd.name),
      { auditUser: "testUser" }
    );

    caseNoteWithActionIdMemoToFile = await models.case_note.create(
      new CaseNote.Builder()
        .defaultCaseNote()
        .withCaseId(existingCase.id)
        .withNotes(caseNoteActionProperties.memoToFile.id)
        .withCaseNoteActionId(caseNoteActionProperties.memoToFile.id),
      { auditUser: "testUser" }
    );

    caseNoteWithActionIdMisc = await models.case_note.create(
      new CaseNote.Builder()
        .defaultCaseNote()
        .withCaseId(existingCase.id)
        .withNotes(caseNoteActionProperties.misc.id)
        .withCaseNoteActionId(caseNoteActionProperties.misc.id),
      { auditUser: "testUser" }
    );

    const updateCaseNotes =
      `UPDATE case_notes SET action = '${
        caseNoteActionProperties.checkedStatus.name
      }' WHERE id = ${caseNoteWithActionStringCheckedStatus.id};` +
      ` UPDATE case_notes SET action = '${
        caseNoteActionProperties.contactedNopd.name
      }' WHERE id = ${caseNoteWithActionStringContactedNopd.id};`;

    await models.sequelize.query(updateCaseNotes, {
      type: models.sequelize.QueryTypes.UPDATE
    });

    testCaseNotes = await models.sequelize.query(selectCaseNotesQuery, {
      type: models.sequelize.QueryTypes.SELECT
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should correctly get case note action id from [case note] action", async () => {
    await models.sequelize.transaction(async transaction => {
      await transformCaseNoteActionToId(
        caseNoteActions,
        testCaseNotes,
        transaction
      );
    });

    const transformedCaseNoteResult = await models.sequelize.query(
      selectCaseNotesQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCaseNoteResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: caseNoteWithActionStringCheckedStatus.id,
          case_note_action_id: caseNoteActionProperties.checkedStatus.id
        }),
        expect.objectContaining({
          id: caseNoteWithActionStringContactedNopd.id,
          case_note_action_id: caseNoteActionProperties.contactedNopd.id
        }),
        expect.objectContaining({
          id: caseNoteWithActionIdMemoToFile.id,
          case_note_action_id: caseNoteWithActionIdMemoToFile.caseNoteActionId
        }),
        expect.objectContaining({
          id: caseNoteWithActionIdMisc.id,
          case_note_action_id: caseNoteWithActionIdMisc.caseNoteActionId
        })
      ])
    );
  });

  test("should convert case note action id to [case note] action", async () => {
    await models.sequelize.transaction(async transaction => {
      await revertTransformCaseNoteActionToId(
        caseNoteActions,
        testCaseNotes,
        transaction
      );
    });

    const transformedCaseNoteResult = await models.sequelize.query(
      selectCaseNotesQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCaseNoteResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: caseNoteWithActionStringCheckedStatus.id,
          action: caseNoteActionProperties.checkedStatus.name
        }),
        expect.objectContaining({
          id: caseNoteWithActionStringContactedNopd.id,
          action: caseNoteActionProperties.contactedNopd.name
        }),
        expect.objectContaining({
          id: caseNoteWithActionIdMemoToFile.id,
          action: caseNoteActionProperties.memoToFile.name
        }),
        expect.objectContaining({
          id: caseNoteWithActionIdMisc.id,
          action: caseNoteActionProperties.misc.name
        })
      ])
    );
  });
});
