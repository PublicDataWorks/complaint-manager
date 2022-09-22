"use strict";

const LETTER_IMAGES_TABLE = "letter_images";
const LETTER_TYPES_LETTER_IMAGES_TABLE = "letter_types_letter_images";

const CREATE_LETTER_IMAGES_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_IMAGES_TABLE} (
  id serial PRIMARY KEY,
  image VARCHAR ( 100 ) NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

const CREATE_LETTER_TYPES_LETTER_IMAGES_QUERY = `CREATE TABLE IF NOT EXISTS ${LETTER_TYPES_LETTER_IMAGES_TABLE} (
  id serial PRIMARY KEY,
  image_id INT NOT NULL,
  letter_id INT NOT NULL,
  max_width VARCHAR ( 100 ),
  name VARCHAR ( 100 ),
  FOREIGN KEY (image_id) REFERENCES ${LETTER_IMAGES_TABLE} (id),
  FOREIGN KEY (letter_id) REFERENCES letter_types (id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(CREATE_LETTER_IMAGES_QUERY, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              CREATE_LETTER_TYPES_LETTER_IMAGES_QUERY,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${LETTER_IMAGES_TABLE} and ${LETTER_TYPES_LETTER_IMAGES_TABLE} tables. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP TABLE IF EXISTS ${LETTER_TYPES_LETTER_IMAGES_TABLE}`, {
            transaction
          })
          .then(async () => {
            await queryInterface.sequelize.query(
              `DROP TABLE IF EXISTS ${LETTER_IMAGES_TABLE}`,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${LETTER_TYPES_LETTER_IMAGES_TABLE} and ${LETTER_IMAGES_TABLE} tables. Internal Error: ${error}`
      );
    }
  }
};
