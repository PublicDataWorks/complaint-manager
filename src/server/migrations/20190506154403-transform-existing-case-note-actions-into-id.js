"use strict";

import models from "../models";
import {
  revertTransformCaseNoteActionToId,
  transformCaseNoteActionToId
} from "../migrationJobs/transformCaseNoteActionToId";

const selectCaseNotesQuery = "SELECT * FROM case_notes;";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const caseNotes = await models.sequelize.query(selectCaseNotesQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const caseNoteActions = await models.case_note_action.findAll();

      await transformCaseNoteActionToId(
        caseNoteActions,
        caseNotes,
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const caseNotes = await models.sequelize.query(selectCaseNotesQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const caseNoteActions = await models.case_note_action.findAll();

      await revertTransformCaseNoteActionToId(
        caseNoteActions,
        caseNotes,
        transaction
      );
    });
  }
};
