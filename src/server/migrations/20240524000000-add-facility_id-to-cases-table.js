"use strict";

const TABLE = "cases";

const ADD_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN IF NOT EXISTS facility_id INT
`;

const ADD_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  ADD CONSTRAINT facility_id_fk
  FOREIGN KEY (facility_id)
  REFERENCES facilities(id)
`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT facility_id_fk
`;

const DROP_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN IF EXISTS facility_id
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
