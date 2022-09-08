"use strict";

const { QUERY_TYPES } = require("../../sharedUtilities/constants");

const TABLE = "public_data_visualizations";
const ENUM = "enum_visualization_query_type";
const CREATE_QUERY_TYPE_ENUM = `CREATE TYPE ${ENUM}
  AS ENUM ('${Object.keys(QUERY_TYPES).join("', '")}')`;
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  id serial PRIMARY KEY, 
  title VARCHAR ( 100 ) NOT NULL,
  subtitle VARCHAR ( 100 ) NOT NULL,
  query_type enum_visualization_query_type NOT NULL,
  collapsed_text TEXT NOT NULL,
  full_message TEXT,
  order_key INT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${ENUM}`, {
          transaction
        });
        await queryInterface.sequelize.query(CREATE_QUERY_TYPE_ENUM, {
          transaction
        });
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
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${ENUM}`, {
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
