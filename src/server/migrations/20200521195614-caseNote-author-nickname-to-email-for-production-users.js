"use strict";

import models from "../complaintManager/models";
import transformNicknameToEmail from "../migrationJobs/transformNicknameToEmail";
import revertNicknameToEmail from "../migrationJobs/revertNicknameToEmail";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const caseNotes = await models.case_note.findAll({});

      try {
        await transformNicknameToEmail(caseNotes, transaction);
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const caseNotes = await models.case_note.findAll({});

      try {
        await revertNicknameToEmail(caseNotes, transaction);
      } catch (error) {
        console.log(error);
      }
    });
  }
};
