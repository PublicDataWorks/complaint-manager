"use strict";

const SIGNERS_TABLE = "signers";
const LETTER_TYPE_TABLE = "letter_types";
const CREATE_SIGNERS_QUERY = `CREATE TABLE IF NOT EXISTS ${SIGNERS_TABLE} (
  id serial PRIMARY KEY,
  name VARCHAR ( 100 ) NOT NULL,
  signature_file VARCHAR ( 50 ) NOT NULL,
  nickname VARCHAR ( 75 ) NOT NULL,
  title VARCHAR ( 100 ),
  phone CHAR ( 12 )
)`;

const CREATE_LETTER_TYPE_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_TYPE_TABLE} (
  id serial PRIMARY KEY,
  type VARCHAR ( 100 ) UNIQUE NOT NULL,
  default_sender INT NOT NULL,
  FOREIGN KEY (default_sender) REFERENCES ${SIGNERS_TABLE} (id)
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(CREATE_SIGNERS_QUERY, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(CREATE_LETTER_TYPE_QUERY, {
              transaction
            });
          });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${SIGNERS_TABLE} and ${LETTER_TYPE_TABLE} tables. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP TABLE IF EXISTS ${LETTER_TYPE_TABLE}`, {
            transaction
          })
          .then(async () => {
            await queryInterface.sequelize.query(
              `DROP TABLE IF EXISTS ${SIGNERS_TABLE}`,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${SIGNERS_TABLE} and ${LETTER_TYPE_TABLE} tables. Internal Error: ${error}`
      );
    }
  }
};
