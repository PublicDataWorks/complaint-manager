"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.addColumn(
          "cases_officers",
          "phone_number",
          {
            type: Sequelize.STRING(10)
          },
          { transaction }
        );
        await queryInterface.addColumn(
          "cases_officers",
          "email",
          {
            type: Sequelize.STRING(100)
          },
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while adding phone number and email columns to case officer. Internal Error ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.removeColumn("cases_officers", "phone_number", {
          transaction
        });
        await queryInterface.removeColumn("cases_officers", "email", {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing phone number and email columns from case officer. Internal Error ${error}`
      );
    }
  }
};
