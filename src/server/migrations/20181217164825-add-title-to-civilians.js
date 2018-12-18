"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("civilians", "title", {
      type: Sequelize.STRING(5)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("civilians", "title");
  }
};
