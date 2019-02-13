"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("cases_officers", "is_anonymous", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("cases_officers", "is_anonymous");
  }
};
