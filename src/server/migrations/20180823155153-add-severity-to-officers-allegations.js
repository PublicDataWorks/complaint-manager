"use strict";
const { ALLEGATION_SEVERITY } = require("../../sharedUtilities/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("officers_allegations", "severity", {
      type: Sequelize.ENUM(ALLEGATION_SEVERITY.ALL),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("officers_allegations", "severity");
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_officers_allegations_severity";'
    );
  }
};
