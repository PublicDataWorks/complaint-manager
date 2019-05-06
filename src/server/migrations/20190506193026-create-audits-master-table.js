"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "audits",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          case_id: {
            type: Sequelize.INTEGER,
            references: {
              model: "cases",
              key: "id"
            }
          },
          audit_action: { type: Sequelize.STRING, allowNull: false },
          user: { type: Sequelize.STRING, allowNull: false },
          created_at: { allowNull: false, type: Sequelize.DATE },
          updated_at: { allowNull: false, type: Sequelize.DATE }
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("audits", transaction);
    });
  }
};
