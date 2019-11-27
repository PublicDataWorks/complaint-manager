"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn("audits", "case_id", "reference_id", {
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn("audits", "reference_id", "case_id", {
        transaction
      });
    });
  }
};
