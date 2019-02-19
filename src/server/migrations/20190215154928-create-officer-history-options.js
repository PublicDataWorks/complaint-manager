"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "officer_history_options",
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
        "letter_officers",
        "officer_history_option_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "officer_history_options",
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
        "letter_officers",
        "officer_history_option_id",
        transaction
      );
      await queryInterface.dropTable("officer_history_options", transaction);
    });
  }
};
