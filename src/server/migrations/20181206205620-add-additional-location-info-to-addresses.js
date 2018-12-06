"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("addresses", "additional_location_info", {
      type: Sequelize.STRING(25)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("addresses", "additional_location_info");
  }
};
