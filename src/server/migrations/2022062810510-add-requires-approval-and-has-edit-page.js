"use strict";

const LETTER_INPUT_PAGES_TABLE = "letter_input_pages";

const LETTER_TYPE = "letter_types";

const CREATE_LETTER_INPUT_PAGES_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_INPUT_PAGES_TABLE} (
  id serial PRIMARY KEY,
  name VARCHAR ( 100 ) NOT NULL,
  key VARCHAR ( 100 ) NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

const LETTER_TYPE_LETTER_INPUT_PAGES_TABLE = "letter_type_letter_input_pages";

const CREATE_LETTER_TYPE_LETTER_INPUT_PAGES_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_TYPE_LETTER_INPUT_PAGES_TABLE} (
  id serial PRIMARY KEY,
  letter_input_pages_id int,
  letter_types_id int,
  FOREIGN KEY (letter_input_pages_id) REFERENCES ${LETTER_INPUT_PAGES_TABLE} (id),
  FOREIGN KEY (letter_types_id) REFERENCES ${LETTER_TYPE} (id)
)`;

const ADD_REQUIRES_APPROVAL_COLUMN_QUERY = `ALTER TABLE letter_types 
  ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN`;

const REMOVE_REQUIRES_APPROVAL_COLUMN_QUERY = `ALTER TABLE letter_types 
DROP COLUMN IF EXISTS requires_approval`;

const ADD_HAS_EDIT_PAGE_COLUMN_QUERY = `ALTER TABLE letter_types 
  ADD COLUMN IF NOT EXISTS has_edit_page BOOLEAN`;

const REMOVE_HAS_EDIT_PAGE_COLUMN_QUERY = `ALTER TABLE letter_types 
DROP COLUMN IF EXISTS has_edit_page`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          ADD_REQUIRES_APPROVAL_COLUMN_QUERY,
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while restructuring cases table to add requires_approval. Internal Error: ${error}`
      );
    }

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_HAS_EDIT_PAGE_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while restructuring cases table to add has_edit_page. Internal Error: ${error}`
      );
    }

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(CREATE_LETTER_INPUT_PAGES_QUERY, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              CREATE_LETTER_TYPE_LETTER_INPUT_PAGES_QUERY,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${LETTER_INPUT_PAGES_TABLE} and ${CREATE_LETTER_TYPE_LETTER_INPUT_PAGES_QUERY} tables. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          REMOVE_HAS_EDIT_PAGE_COLUMN_QUERY,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back has_edit_page update. Internal Error: ${error}`
      );
    }

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          REMOVE_REQUIRES_APPROVAL_COLUMN_QUERY,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back requires_approval update. Internal Error: ${error}`
      );
    }

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(
            `DROP TABLE IF EXISTS ${LETTER_TYPE_LETTER_INPUT_PAGES_TABLE}`,
            {
              transaction
            }
          )
          .then(async () => {
            await queryInterface.sequelize.query(
              `DROP TABLE IF EXISTS ${LETTER_INPUT_PAGES_TABLE}`,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${LETTER_INPUT_PAGES_TABLE} and ${LETTER_TYPE_LETTER_INPUT_PAGES_TABLE} tables. Internal Error: ${error}`
      );
    }
  }
};
