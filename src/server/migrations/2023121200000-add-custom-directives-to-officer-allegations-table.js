"use strict";

const ADD_CUSTOM_DIRECTIVE_COLUMN = `ALTER TABLE officers_allegations
  ADD COLUMN custom_directive TEXT`;

const DROP_CUSTOM_DIRECTIVE_COLUMN = `ALTER TABLE officers_allegations
DROP COLUMN custom_directive`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_CUSTOM_DIRECTIVE_COLUMN, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while adding template columns to letter types table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_CUSTOM_DIRECTIVE_COLUMN, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing template columns from letter types table. Internal Error: ${error}`
      );
    }
  }
};
