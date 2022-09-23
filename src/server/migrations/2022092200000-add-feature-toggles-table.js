"use strict";

const FEATURE_TOGGLES_TABLE = "feature_toggles";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${FEATURE_TOGGLES_TABLE} (
    name VARCHAR ( 100 ) PRIMARY KEY,
    description VARCHAR ( 100 ) NOT NULL,
    enabled BOOLEAN NOT NULL,
    is_dev BOOLEAN NOT NULL
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
        `Error while creating ${FEATURE_TOGGLES_TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS ${FEATURE_TOGGLES_TABLE}`,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${FEATURE_TOGGLES_TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
