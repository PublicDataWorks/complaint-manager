"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("matrices", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        pib_control_number: {
          allowNull: false,
          type: Sequelize.STRING
        },
        first_reviewer: {
          allowNull: false,
          type: Sequelize.STRING
        },
        second_reviewer: {
          allowNull: false,
          type: Sequelize.STRING
        },
        created_at: { allowNull: false, type: Sequelize.DATE },
        updated_at: { allowNull: false, type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE }
      });
    });
  },

  down: (queryInterface, Sequelize) => {}
};
