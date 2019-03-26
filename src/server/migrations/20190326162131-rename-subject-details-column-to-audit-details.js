"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "action_audits",
      "subject_details",
      "audit_details"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "action_audits",
      "audit_details",
      "subject_details"
    );
  }
};
