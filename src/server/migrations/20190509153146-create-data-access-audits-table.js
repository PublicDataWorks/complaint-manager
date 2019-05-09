"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "data_access_audits",
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
          audit_subject: {
            allowNull: false,
            type: Sequelize.STRING
          }
        },
        {
          transaction
        }
      );
      await queryInterface.createTable(
        "data_access_values",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          data_access_audit_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
              model: "data_access_audits",
              key: "id"
            }
          },
          association: {
            allowNull: false,
            type: Sequelize.STRING
          },
          fields: {
            allowNull: false,
            type: Sequelize.JSONB
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
      await queryInterface.dropTable("data_access_values", transaction);
      await queryInterface.dropTable("data_access_audits", transaction);
    });
  }
};
