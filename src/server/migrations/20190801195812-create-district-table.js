"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("districts", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      });

      await queryInterface.addColumn(
        "cases",
        "district_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "districts",
            key: "id"
          }
        },
        transaction
      );
      await queryInterface.addColumn(
        "officers",
        "district_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "districts",
            key: "id"
          }
        },
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("cases", "district_id", transaction);
      await queryInterface.removeColumn("officers", "district_id", transaction);
      await queryInterface.dropTable("districts", transaction);
    });
  }
};
