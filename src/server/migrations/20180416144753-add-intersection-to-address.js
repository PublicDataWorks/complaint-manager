"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("addresses", "intersection", {
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("addresses", "intersection");
  }
};
