"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("addresses", "place_id", {
      type: Sequelize.STRING(1023)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("addresses", "place_id", {
      type: Sequelize.STRING(255)
    });
  }
};
