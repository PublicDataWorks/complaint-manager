"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("user_actions", "case_notes");

    const query = `UPDATE data_change_audits SET model_name='case_note' WHERE model_name='user_action'`;
    await queryInterface.sequelize.query(query);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("case_notes", "user_actions");

    const query = `UPDATE data_change_audits SET model_name='user_action' WHERE model_name='case_note'`;
    await queryInterface.sequelize.query(query);
  }
};
