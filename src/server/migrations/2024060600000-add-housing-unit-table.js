"use strict";

const TABLE = "housing_units";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  facility_id INT NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

const ADD_FOREIGN_KEY = `ALTER TABLE ${TABLE}
  ADD CONSTRAINT fk_facility_id
  FOREIGN KEY (facility_id)
  REFERENCES facilities(id)
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_TABLE_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(ADD_FOREIGN_KEY, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${TABLE}`, {
        transaction
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
