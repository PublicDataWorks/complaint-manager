"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn("data_change_audits", "case_id", {
        allowNull: true,
        type: Sequelize.INTEGER
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn("data_change_audits", "case_id", {
        allowNull: false,
        type: Sequelize.INTEGER
      });
    });
  }
};
