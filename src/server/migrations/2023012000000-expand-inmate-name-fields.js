"use strict";

const TABLE = "inmates";

const ALTER_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ALTER COLUMN first_name TYPE VARCHAR (100),
  ALTER COLUMN last_name TYPE VARCHAR (100),
  ALTER COLUMN race TYPE VARCHAR (100)
`;

const REVERT_QUERY = `
  ALTER TABLE ${TABLE}
  ALTER COLUMN first_name TYPE VARCHAR (30),
  ALTER COLUMN last_name TYPE VARCHAR (30),
  ALTER COLUMN race TYPE VARCHAR (30)
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ALTER_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while altering ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
