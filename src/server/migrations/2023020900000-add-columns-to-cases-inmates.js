"use strict";

const TABLE = "cases_inmates";

const ALTER_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN case_inmate_id,
  ADD COLUMN id serial PRIMARY KEY,
  ADD COLUMN deleted_at timestamp
`;

const REVERT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN id,
  ADD COLUMN case_inmate_id serial PRIMARY KEY,
  DROP COLUMN deleted_at timestamp
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
