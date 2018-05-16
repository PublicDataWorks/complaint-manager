"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("addresses", "deleted_at", {
      type: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("addresses", "deleted_at");
  }
};
