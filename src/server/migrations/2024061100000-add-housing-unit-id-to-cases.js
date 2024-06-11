"use strict";

const TABLE = "cases";

const ADD_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN IF NOT EXISTS housing_unit_id INT
`;

const ADD_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  ADD CONSTRAINT case_housing_unit_id_fk
  FOREIGN KEY (housing_unit_id)
  REFERENCES housing_units(id)
`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT case_housing_unit_id_fk
`;

const DROP_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN IF EXISTS housing_unit_id
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
