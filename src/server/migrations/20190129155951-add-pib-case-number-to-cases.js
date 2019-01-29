"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("cases", "pib_case_number", {
      type: Sequelize.STRING(25)
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("cases", "pib_case_number");
  }
};
