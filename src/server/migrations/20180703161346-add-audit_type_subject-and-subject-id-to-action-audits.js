"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("action_audits", "audit_type", {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn("action_audits", "subject", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("action_audits", "subject_id", {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("action_audits", "audit_type");
    await queryInterface.removeColumn("action_audits", "subject");
    await queryInterface.removeColumn("action_audits", "subject_id");
  }
};
