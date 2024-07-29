"use strict";

const TABLE = "cases";

const ADD_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN IF NOT EXISTS nopd_case_number VARCHAR (50)
`;

const DROP_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN IF EXISTS nopd_case_number
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while adding NOPD case number to ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing NOPD case number from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
