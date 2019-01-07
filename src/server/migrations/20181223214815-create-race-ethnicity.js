"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("race_ethnicities", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: { type: Sequelize.STRING, allow: false },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      });

      await queryInterface.addColumn(
        "civilians",
        "race_ethnicity_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "race_ethnicities",
            key: "id"
          }
        },
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "civilians",
        "race_ethnicity_id",
        transaction
      );
      await queryInterface.dropTable("race_ethnicities", transaction);
    });
  }
};
