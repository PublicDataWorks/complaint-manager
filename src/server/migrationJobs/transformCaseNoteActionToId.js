// this no longer works as we have removed the action column

import _ from "lodash";
import models from "../policeDataManager/models";

export const transformCaseNoteActionToId = async (
  caseNoteActions,
  caseNotes,
  transaction
) => {
  const caseNoteActionDictionary = {};
  caseNoteActions.forEach(caseNoteAction => {
    caseNoteActionDictionary[caseNoteAction.name] = caseNoteAction.id;
  });

  for (let i = 0; i < caseNotes.length; i++) {
    if (!caseNotes[i].case_note_action_id && !_.isEmpty(caseNotes[i].action)) {
      await updateDatabaseWithCorrectCaseNoteActionId(
        caseNotes[i],
        caseNoteActionDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectCaseNoteActionId = async (
  caseNote,
  caseNoteActionDictionary,
  transaction
) => {
  const updateCaseQuery = `UPDATE case_notes SET case_note_action_id = ${
    caseNoteActionDictionary[caseNote.action]
  } WHERE id = ${caseNote.id}`;

  await models.sequelize.query(updateCaseQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};

export const revertTransformCaseNoteActionToId = async (
  caseNoteActions,
  caseNotes,
  transaction
) => {
  const caseNoteActionDictionary = {};
  caseNoteActions.forEach(caseNoteAction => {
    caseNoteActionDictionary[caseNoteAction.id] = caseNoteAction.name;
  });

  for (let i = 0; i < caseNotes.length; i++) {
    if (caseNotes[i].case_note_action_id) {
      await updateDatabaseWithCorrectActionString(
        caseNotes[i],
        caseNoteActionDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectActionString = async (
  caseNote,
  caseNoteActionDictionary,
  transaction
) => {
  const updateCaseNoteQuery = `UPDATE case_notes SET action = '${
    caseNoteActionDictionary[caseNote.case_note_action_id]
  }', case_note_action_id = null WHERE id = ${caseNote.id}`;

  await models.sequelize.query(updateCaseNoteQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};
