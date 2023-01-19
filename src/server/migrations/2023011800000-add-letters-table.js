"use strict";

const CREATE_LETTERS_TABLE = `CREATE TABLE letters (
  id SERIAL PRIMARY KEY,
  case_id INTEGER,
  recipient TEXT,
  recipient_address TEXT,
  sender TEXT,
  transcribed_by VARCHAR(255),
  edited_letter_html TEXT,
  final_pdf_filename VARCHAR(255),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  FOREIGN KEY (case_id) REFERENCES cases (id)
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_LETTERS_TABLE, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating the letters table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query("DROP TABLE IF EXISTS letters", {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing the letters table. Internal Error: ${error}`
      );
    }
  }
};
