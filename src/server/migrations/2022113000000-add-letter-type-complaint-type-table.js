"use strict";

const LETTER_TYPE_COMPLAINT_TYPE_TABLE = "letter_type_complaint_type";

const CREATE_LETTER_TYPE_COMPLAINT_TYPE_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_TYPE_COMPLAINT_TYPE_TABLE} (
  id serial PRIMARY KEY,
  letter_type_id INT NOT NULL,
  complaint_type_id TEXT NOT NULL,
  FOREIGN KEY (letter_type_id) REFERENCES letter_types (id),
  FOREIGN KEY (complaint_type_id) REFERENCES complaint_types (name),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          CREATE_LETTER_TYPE_COMPLAINT_TYPE_QUERY,
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${CREATE_LETTER_TYPE_COMPLAINT_TYPE_QUERY} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS ${LETTER_TYPE_COMPLAINT_TYPE_TABLE}`,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${LETTER_TYPE_COMPLAINT_TYPE_TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
