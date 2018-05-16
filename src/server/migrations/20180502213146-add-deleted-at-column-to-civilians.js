"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("civilians", "deleted_at", {
      type: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("civilians", "deleted_at");
  }
};
