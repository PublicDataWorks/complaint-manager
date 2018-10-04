"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn(
      "classifications",
      "abbreviation",
      "initialism"
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn(
      "classifications",
      "initialism",
      "abbreviation"
    );
  }
};
