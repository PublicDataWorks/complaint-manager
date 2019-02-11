"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("addresses", "additional_location_info", {
      type: Sequelize.STRING(255)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("addresses", "additional_location_info", {
      type: Sequelize.STRING(25)
    });
  }
};
