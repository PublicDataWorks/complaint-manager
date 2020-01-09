"use strict";

import models from "../complaintManager/models";
import { deleteDuplicateRowsByName } from "../migrationJobs/deleteDuplicateRowsByName";
import { transformDuplicateCaseNoteActionsId } from "../migrationJobs/transformDuplicateCaseNoteActions";

const LAST_GOOD_CASE_NOTE_ACTION_ID = 18;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    await queryInterface.sequelize.transaction(async transaction => {
      const caseNotesWithIncorrectActionIds = await models.case_note.findAll({
        where: {
          case_note_action_id: { [Op.gt]: LAST_GOOD_CASE_NOTE_ACTION_ID }
        }
      });

      try {
        await transformDuplicateCaseNoteActionsId(
          caseNotesWithIncorrectActionIds,
          LAST_GOOD_CASE_NOTE_ACTION_ID,
          Op,
          transaction
        )
      } catch(error) {
        console.log(error);
      }

      const duplicateRows = await models.case_note_action.findAll({
        where: {
          id: { [Op.gt]: LAST_GOOD_CASE_NOTE_ACTION_ID }
        }
      });

      const originalRows = await models.case_note_action.findAll({
        where: {
          id: { [Op.lte]: LAST_GOOD_CASE_NOTE_ACTION_ID }
        }
      });

      try {
        await deleteDuplicateRowsByName(
          duplicateRows,
          originalRows,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Since we are reverting a bad state of data, we do not need a down migration.
    */
  }
};
