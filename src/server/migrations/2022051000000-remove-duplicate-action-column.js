"use strict";

const ADD_COLUMN_QUERY = `ALTER TABLE case_notes
  ADD COLUMN IF NOT EXISTS action VARCHAR(255)`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE case_notes 
  DROP COLUMN IF EXISTS action`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REMOVE_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while restructuring case notes table to remove duplicate action column. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back duplicate action column update. Internal Error: ${error}`
      );
    }
  }
};
