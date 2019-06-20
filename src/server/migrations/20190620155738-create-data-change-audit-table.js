"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "data_change_audits",
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
          model_name: {
            allowNull: false,
            type: Sequelize.STRING
          },
          model_description: {
            type: Sequelize.JSONB
          },
          model_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          snapshot: {
            allowNull: false,
            type: Sequelize.JSONB
          },
          changes: {
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
      await queryInterface.dropTable("data_change_audits", transaction);
    });
  }
};
