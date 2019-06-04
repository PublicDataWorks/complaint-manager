"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "file_audits",
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
          fileType: {
            field: "file_type",
            allowNull: false,
            type: Sequelize.STRING
          },
          fileName: {
            field: "file_name",
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
      await queryInterface.dropTable("file_audits", transaction);
    });
  }
};
