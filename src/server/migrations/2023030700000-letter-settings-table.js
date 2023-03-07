"use strict";

const TABLE = "letter_settings";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  type VARCHAR(50) PRIMARY KEY,
  format VARCHAR(50) NOT NULL DEFAULT 'Letter',
  width VARCHAR (50) NOT NULL DEFAULT '8.5in',
  height VARCHAR (50) NOT NULL DEFAULT '11in',
  border VARCHAR (50) NOT NULL DEFAULT '0.5in',
  header_height VARCHAR (50) NOT NULL DEFAULT '2in',
  footer_height VARCHAR (50) NOT NULL DEFAULT '0.7in',
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
