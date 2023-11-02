"use strict";
const ADD_COLUMN_QUERY = `ALTER TABLE rule_chapters 
  ADD COLUMN IF NOT EXISTS is_deprecated BOOLEAN DEFAULT false`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE rule_chapters 
  DROP COLUMN IF EXISTS is_deprecated`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while adding is_deprecated to rule_chapters table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REMOVE_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back update to rule_chapters table. Internal Error: ${error}`
      );
    }
  }
};
