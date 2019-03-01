"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "initial_discovery_sources",
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
        "initial_discovery_source_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "initial_discovery_sources",
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
        "initial_discovery_source_id",
        transaction
      );
      await queryInterface.dropTable("initial_discovery_sources", transaction);
    });
  }
};
