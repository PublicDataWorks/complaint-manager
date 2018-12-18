"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cases", "intake_source", {
      type: Sequelize.STRING(50)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases", "intake_source");
  }
};
