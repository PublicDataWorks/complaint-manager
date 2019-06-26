"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("legacy_data_access_audits", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        audit_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "audits",
            key: "id"
          }
        },
        audit_subject: {
          allowNull: false,
          type: Sequelize.STRING
        },
        audit_details: {
          allowNull: false,
          type: Sequelize.JSONB
        }
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("legacy_data_access_audits", transaction);
    });
  }
};
