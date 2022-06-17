"use strict";

const LETTER_FIELDS_TABLE = "letter_fields";
const LETTER_TYPE_TABLE = "letter_types";
const CREATE_LETTER_FIELDS_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_FIELDS_TABLE} (
  id serial PRIMARY KEY,
  field VARCHAR ( 100 ) NOT NULL,
  relation VARCHAR ( 100 ) NOT NULL,
  is_required BOOLEAN NOT NULL,
  is_for_body BOOLEAN NOT NULL,
  letter_type INT NOT NULL,
  sort_by VARCHAR ( 50 ),
  sort_direction VARCHAR ( 4 ),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  FOREIGN KEY (letter_type) REFERENCES ${LETTER_TYPE_TABLE} (id)
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_LETTER_FIELDS_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${LETTER_FIELDS_TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS ${LETTER_FIELDS_TABLE}`,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${LETTER_FIELDS_TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
