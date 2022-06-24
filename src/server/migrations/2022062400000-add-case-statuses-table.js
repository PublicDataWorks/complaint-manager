"use strict";

const CASE_STATUS_TABLE = "case_statuses";
const LETTER_TYPES_TABLE = "letter_types";

const CREATE_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS ${CASE_STATUS_TABLE} (
    id serial PRIMARY KEY, 
    name VARCHAR ( 50 ) NOT NULL,
    order_key INT NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
  )
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_TABLE_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${CASE_STATUS_TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS ${CASE_STATUS_TABLE}`,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${CASE_STATUS_TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
