"use strict";

const UPDATE_LETTER_TYPES = `ALTER TABLE letter_types
	ADD COLUMN template TEXT NOT NULL DEFAULT '',
	ADD COLUMN editable_template TEXT`;

const REVERT_LETTER_TYPES = `ALTER TABLE letter_types
	DROP COLUMN template,
	DROP COLUMN editable_template`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(UPDATE_LETTER_TYPES, {
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
        await queryInterface.sequelize.query(REVERT_LETTER_TYPES, {
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
