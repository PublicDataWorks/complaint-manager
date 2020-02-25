"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable("notifications", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        case_note_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        user: {
          allowNull: false,
          type: Sequelize.STRING
        },
        preview_text: {
          allowNull: false,
          type: Sequelize.STRING
        },
        has_been_read: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        created_at: { allowNull: false, type: Sequelize.DATE },
        updated_at: { allowNull: false, type: Sequelize.DATE },
        deleted_at: { type: Sequelize.DATE }
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("notifications", transaction);
    });
  }
};
