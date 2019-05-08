"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "export_audits",
        {
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
          export_type: {
            allowNull: false,
            type: Sequelize.STRING
          },
          range_type: {
            allowNull: true,
            type: Sequelize.STRING
          },
          range_start: {
            allowNull: true,
            type: Sequelize.STRING
          },
          range_end: {
            allowNull: true,
            type: Sequelize.STRING
          }
        },
        {
          transaction
        }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("export_audits", transaction);
    });
  }
};
