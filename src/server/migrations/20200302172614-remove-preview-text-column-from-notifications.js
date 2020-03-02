"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("notifications", "preview_text", {
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {}
};
