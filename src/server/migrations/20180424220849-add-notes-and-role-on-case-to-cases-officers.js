"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cases_officers", "notes", {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn("cases_officers", "role_on_case", {
      type: Sequelize.ENUM(["Accused"])
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases_officers", "notes");
    await queryInterface.removeColumn("cases_officers", "role_on_case");
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_cases_officers_role_on_case";'
    );
  }
};
