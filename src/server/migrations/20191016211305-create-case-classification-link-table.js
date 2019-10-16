"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("case_classifications", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        case_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        new_classification_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        created_at: { allowNull: false, type: Sequelize.DATE },
        updated_at: { allowNull: false, type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE }
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("case_classifications", transaction);
    });
  }
};
