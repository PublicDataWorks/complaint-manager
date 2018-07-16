"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("action_audits", "subject_details");
    await queryInterface.addColumn("action_audits", "subject_details", {
      field: "subject_details",
      type: Sequelize.JSONB
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("action_audits", "subject_details");
    await queryInterface.addColumn("action_audits", "subject_details", {
      field: "subject_details",
      type: Sequelize.STRING
    });
  }
};
