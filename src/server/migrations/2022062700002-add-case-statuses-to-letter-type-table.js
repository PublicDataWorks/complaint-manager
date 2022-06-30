"use strict";

const TABLE = "letter_types";

const ADD_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN IF NOT EXISTS required_status INT
`;

const ADD_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  ADD CONSTRAINT case_statuses_fk
  FOREIGN KEY (required_status)
  REFERENCES case_statuses(id)
`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT case_statuses_fk
`;

const DROP_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN IF EXISTS required_status
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(ADD_CONSTRAINT_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while adding foreign key to ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_CONSTRAINT_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(DROP_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing foreign key from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
