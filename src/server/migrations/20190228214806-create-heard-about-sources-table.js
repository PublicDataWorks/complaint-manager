"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "heard_about_sources",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: { type: Sequelize.STRING, allow: false },
          createdAt: { allowNull: false, type: Sequelize.DATE },
          updatedAt: { allowNull: false, type: Sequelize.DATE }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "cases",
        "heard_about_source_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "heard_about_sources",
            key: "id"
          }
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "cases",
        "heard_about_source_id",
        transaction
      );
      await queryInterface.dropTable("heard_about_sources", transaction);
    });
  }
};
