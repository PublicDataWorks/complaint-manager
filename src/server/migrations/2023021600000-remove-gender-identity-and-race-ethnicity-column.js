"use strict";

const ADD_COLUMN_QUERY = `ALTER TABLE cases 
  ADD COLUMN IF NOT EXISTS gender_identity enum_civilians_gender_identity, 
  ADD COLUMN IF NOT EXISTS race_ethnicity VARCHAR(255)`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE cases 
  DROP COLUMN IF EXISTS gender_identity,
  DROP COLUMN IF EXISTS race_ethnicity`;


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
        `Error while restructuring cases table to remove duplicate gender identity and race ethnicity. Internal Error: ${error}`
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
        `Error while rolling back gender identity and race ethnicity duplicate update. Internal Error: ${error}`
      );
    }
  }
};
