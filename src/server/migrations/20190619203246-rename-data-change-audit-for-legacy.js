"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameTable(
        "data_change_audits",
        "legacy_data_change_audits"
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameTable(
        "legacy_data_change_audits",
        "data_change_audits"
      );
    });
  }
};
