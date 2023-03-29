"use strict";

const TABLE = "person_types";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  key VARCHAR(50) PRIMARY KEY,
  description TEXT UNIQUE NOT NULL,
  employee_description TEXT,
  abbreviation VARCHAR(10) NOT NULL,
  legend TEXT NOT NULL,
  dialog_action VARCHAR(50) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  sub_types TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

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
        `Error while creating ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
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
