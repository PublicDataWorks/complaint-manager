"use strict";
const ADD_COLUMN_QUERY = `ALTER TABLE facilities 
  ADD COLUMN IF NOT EXISTS address TEXT`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE facilities 
  DROP COLUMN IF EXISTS address`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while adding address to facility table. Internal Error: ${error}`
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
        `Error while rolling back update to facility table. Internal Error: ${error}`
      );
    }
  }
};
