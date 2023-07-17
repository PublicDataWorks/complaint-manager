"use strict";

const TABLE = "directives";

const CREATE_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS ${TABLE} (
    id serial PRIMARY KEY, 
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
  )
`;

const FOREIGN_KEY_QUERY = `
    ALTER TABLE officers_allegations
      ADD COLUMN IF NOT EXISTS directive INT,
      ADD CONSTRAINT officers_allegations_directives_fk
        FOREIGN KEY (directive)
        REFERENCES ${TABLE}(id)
`;

const REVERT_FOREIGN_KEY_QUERY = `
    ALTER TABLE officers_allegations
      DROP CONSTRAINT officers_allegations_directives_fk,
      DROP COLUMN IF EXISTS directive
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_TABLE_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(FOREIGN_KEY_QUERY, {
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
        await queryInterface.sequelize.query(REVERT_FOREIGN_KEY_QUERY),
          {
            transaction
          };
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
