"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("addresses", "lat", {
      type: Sequelize.FLOAT
    });
    await queryInterface.addColumn("addresses", "lng", {
      type: Sequelize.FLOAT
    });
    await queryInterface.addColumn("addresses", "place_id", {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("addresses", "lat");
    await queryInterface.removeColumn("addresses", "lng");
    await queryInterface.removeColumn("addresses", "place_id");
  }
};
