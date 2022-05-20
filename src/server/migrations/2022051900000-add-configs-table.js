"use strict";

const TABLE = "configs";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  name VARCHAR ( 50 ) PRIMARY KEY,
  value VARCHAR ( 100 ) NOT NULL,
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
