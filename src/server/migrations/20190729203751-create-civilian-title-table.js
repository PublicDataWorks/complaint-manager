"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("civilian_titles", {
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
        "civilians",
        "civilian_title_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "civilian_titles",
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
        "civilian_title_id",
        transaction
      );
      await queryInterface.dropTable("civilian_titles", transaction);
    });
  }
};
