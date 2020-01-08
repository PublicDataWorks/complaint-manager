"use strict";

import models from "../complaintManager/models";

const LAST_GOOD_CASE_NOTE_ACTION_ID = 18;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    await queryInterface.sequelize.transaction(async transaction => {
      try {
        const caseNotesWithIncorrectActionIds = await models.case_note.findAll({
          where: {
            case_note_action_id: { [Op.gt]: LAST_GOOD_CASE_NOTE_ACTION_ID }
          }
        });

        await caseNotesWithIncorrectActionIds.forEach(
          async caseNoteRow => {
            const actionName = await models.case_note_action.findOne({
              attributes: ["name"],
              where: { id: caseNoteRow.caseNoteActionId}
            });

            if(actionName.name != null) {
              const correctId = await models.case_note_action.findOne({
                where: {
                  name: actionName.name,
                  id: { [Op.lte]: LAST_GOOD_CASE_NOTE_ACTION_ID}
                }
              });

              const user = caseNoteRow.user;

              caseNoteRow.caseNoteActionId = correctId.id;
              // const user = await models.case_note.findOne({
              //   attributes: ["user"],
              //   where: {
              //     id: caseNoteRow.id
              //   }
              // });
              caseNoteRow.save({
                auditUser: user
              });
            }
          }
        );

        const duplicateRows = await models.case_note_action.findAll({
          where: {
            id: { [Op.gt]: LAST_GOOD_CASE_NOTE_ACTION_ID}
          }
        });

        const originalRows = await models.case_note_action.findAll({
          where: {
            id: { [Op.lte]: LAST_GOOD_CASE_NOTE_ACTION_ID}
          }
        });

        await duplicateRows.forEach(async duplicateRow => {
          await originalRows.forEach(async originalRow => {
            if (originalRow.name === duplicateRow.name) {
              await duplicateRow.destroy();
            }
          })
        })

      } catch (e) {
        console.error(e);
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Since we are reverting a bad state of data, we do not need a down migration.
    */
  }
};
