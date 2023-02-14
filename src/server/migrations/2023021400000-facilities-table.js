"use strict";

const TABLE = "facilities";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
    id serial NOT NULL PRIMARY KEY,
    abbreviation VARCHAR ( 50 ) NOT NULL,
    name VARCHAR ( 150 ) NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)`;

const CREATE_FOREIGN_KEY_QUERY = `ALTER TABLE inmates
  ADD COLUMN facility_id INTEGER,
  ADD CONSTRAINT facility_id_fkey
    FOREIGN KEY (facility_id)
    REFERENCES facilities(id)
`;

const DROP_FOREIGN_KEY_QUERY = `ALTER TABLE inmates
  DROP CONSTRAINT facility_id_fkey,
  DROP COLUMN facility_id
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_TABLE_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(CREATE_FOREIGN_KEY_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_FOREIGN_KEY_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${TABLE}`, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
