"use strict";

const LETTER_IMAGES_TABLE = "letter_images";
const LETTER_TYPES_LETTER_IMAGES_TABLE = "letter_types_letter_images";

const INSERT_LETTER_IMAGES = `INSERT INTO ${LETTER_IMAGES_TABLE}(image) 
  VALUES ${
    process.env.ORG === "HAWAII"
      ? "('hawaii_header_text.png'), ('hawaii_icon.jpeg')"
      : "('header_text.png'), ('icon.png')"
  }
`;

const INSERT_LETTER_TYPES_LETTER_IMAGES = `INSERT INTO ${LETTER_TYPES_LETTER_IMAGES_TABLE}(image_id, letter_id, max_width, name) 
  VALUES ${
    process.env.ORG === "HAWAII"
      ? `({headerImageId}, {cannotHelpLetterId}, '550px', 'header')`
      : `({headerImageId}, {referralLetterId}, '450px', 'header'), 
        ({iconImageId}, {referralLetterId}, '60px', 'smallIcon'), 
        ({headerImageId}, {complainantLetterId}, '450px', 'header'), 
        ({iconImageId}, {complainantLetterId}, '60px', 'smallIcon')`
  }
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_LETTER_IMAGES, {
          transaction
        });

        const imageId = await queryInterface.sequelize.query(
          `SELECT id, image FROM ${LETTER_IMAGES_TABLE}`,
          {
            transaction
          }
        );
        const letterId = await queryInterface.sequelize.query(
          "SELECT id, type FROM letter_types",
          {
            transaction
          }
        );

        let query = INSERT_LETTER_TYPES_LETTER_IMAGES;
        imageId[0].forEach(element => {
          query = query.replaceAll(
            element.image.includes("header")
              ? "{headerImageId}"
              : "{iconImageId}",
            element.id
          );
        });
        letterId[0].forEach(element => {
          let templateVar;
          switch (element.type) {
            case "REFERRAL":
              templateVar = "{referralLetterId}";
              break;
            case "COMPLAINANT":
              templateVar = "{complainantLetterId}";
              break;
            case "CAN'T HELP":
              templateVar = "{cannotHelpLetterId}";
          }

          if (templateVar) {
            query = query.replaceAll(templateVar, element.id);
          }
        });

        await queryInterface.sequelize.query(query, {
          transaction
        });
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
