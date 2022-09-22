"use strict";

const LETTER_IMAGES_TABLE = "letter_images";
const LETTER_TYPES_LETTER_IMAGES_TABLE = "letter_types_letter_images";

const INSERT_LETTER_IMAGES = `INSERT INTO ${LETTER_IMAGES_TABLE}(image) 
  VALUES ('header_text.png'), ('icon.png')
`;

const INSERT_LETTER_TYPES_LETTER_IMAGES = `INSERT INTO ${LETTER_TYPES_LETTER_IMAGES_TABLE}(image_id, letter_id, max_width, name) 
  VALUES 
    (1, 1, '450px', 'header'), 
    (2, 1, '60px', 'smallIcon'), 
    (1, 2, '450px', 'header'), 
    (2, 2, '60px', 'smallIcon')
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(INSERT_LETTER_IMAGES, {
            transaction
          })
          .then(
            queryInterface.sequelize.query(INSERT_LETTER_TYPES_LETTER_IMAGES, {
              transaction
            })
          );
      });
    } catch (error) {
      throw new Error(
        `Error while seeding data into ${LETTER_IMAGES_TABLE} and ${LETTER_TYPES_LETTER_IMAGES_TABLE} tables. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize
        .query(`TRUNCATE ${LETTER_TYPES_LETTER_IMAGES_TABLE} CASCADE`, {
          transaction
        })
        .then(
          queryInterface.sequelize.query(
            `TRUNCATE ${LETTER_IMAGES_TABLE} CASCADE`,
            {
              transaction
            }
          )
        );
    });
  }
};
