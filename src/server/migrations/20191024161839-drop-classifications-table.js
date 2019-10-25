"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "cases",
        "classification_id",
        transaction
      );
      await queryInterface.dropTable("classifications", transaction);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "classifications",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          abbreviation: {
            type: Sequelize.STRING,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "cases",
        "classification_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "classifications",
            key: "id"
          }
        },
        { transaction }
      );
    });
  }
};
