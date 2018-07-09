"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("data_change_audits");
    await queryInterface.removeColumn(
      "data_change_audits",
      "model_description"
    );
    await queryInterface.addColumn("data_change_audits", "model_description", {
      type: Sequelize.JSONB,
      field: "model_description"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("data_change_audits");
    await queryInterface.removeColumn(
      "data_change_audits",
      "model_description"
    );
    await queryInterface.addColumn("data_change_audits", "model_description", {
      type: Sequelize.STRING,
      field: "model_description"
    });
  }
};
