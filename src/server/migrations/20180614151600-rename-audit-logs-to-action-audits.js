"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("audit_logs", "action_audits");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("action_audits", "audit_logs");
  }
};
