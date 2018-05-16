"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE audit_logs ALTER COLUMN case_id DROP NOT NULL;`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE audit_logs ALTER COLUMN case_id SET NOT NULL;`
    );
  }
};
