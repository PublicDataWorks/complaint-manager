"use strict";

const LETTER_INPUT_PAGES = "letter_input_pages";

const LETTER_TYPE_LETTER_INPUT_PAGES = "letter_type_letter_input_pages";

const INSERT_LETTER_INPUT_PAGES = `INSERT INTO ${LETTER_INPUT_PAGES} (id, name, key) 
  VALUES (1,'Lettter Review', 'LETTER_REVIEW'), 
  (2, 'Review and Approve Letter', 'REVIEW_AND_APPROVE_LETTER'), 
  (3, 'Classifications', 'CLASSIFICATIONS'), 
  (4, 'Officer Histories', 'OFFICER_HISTORIES'), 
  (5, 'Recommended Actions', 'RECOMMENDED_ACTIONS')`;
const INSERT_LETTER_TYPE_LETTER_INPUT_PAGES = `INSERT INTO ${LETTER_TYPE_LETTER_INPUT_PAGES} (letter_input_pages_id, letter_types_id) 
  VALUES (1, {referralLetterId}), 
    (2, {referralLetterId}),
    (3, {referralLetterId}),
    (4, {referralLetterId}),
    (5, {referralLetterId})`;

const UPDATE_REFERRAL_LETTER = `UPDATE letter_types 
SET has_edit_page = true, requires_approval = true
WHERE "type" = 'REFERRAL'`;

const NULL_LETTER_TYPES = `UPDATE letter_types 
SET has_edit_page = false, requires_approval = false`;

const UPDATE_COMPLAINANT_LETTER = `UPDATE letter_types 
SET has_edit_page = false, requires_approval = false
WHERE "type" = 'COMPLAINANT'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "NOIPM") {
      try {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize.query(UPDATE_REFERRAL_LETTER, {
            transaction
          });
          await queryInterface.sequelize.query(UPDATE_COMPLAINANT_LETTER, {
            transaction
          });
        });
      } catch (error) {
        throw new Error(
          `Error while seeding and update of letter types to include has_edit_page and requires_approval ${error}`
        );
      }

      try {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize
            .query(UPDATE_REFERRAL_LETTER, { transaction })
            .then(async () => {
              await queryInterface.sequelize.query(UPDATE_COMPLAINANT_LETTER, {
                transaction
              });
            });
        });
      } catch (error) {
        throw new Error(
          `Error while seeding and update of letter types to include has_edit_page and requires_approval ${error}`
        );
      }

      try {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize
            .query(INSERT_LETTER_INPUT_PAGES, { transaction })
            .then(async () => {
              const referralLetterId = await queryInterface.sequelize.query(
                "SELECT id FROM letter_types WHERE type = 'REFERRAL'"
              );
              await queryInterface.sequelize.query(
                INSERT_LETTER_TYPE_LETTER_INPUT_PAGES.replaceAll(
                  "{referralLetterId}",
                  referralLetterId[0][0].id
                ),
                {
                  transaction
                }
              );
            });
        });
      } catch (error) {
        throw new Error(
          `Error while seeding Letter Input Pages and Letter Type letter Input Pages ${error}`
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(NULL_LETTER_TYPES, {
        transaction
      });
    });

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`TRUNCATE ${LETTER_TYPE_LETTER_INPUT_PAGES} CASCADE`, {
            transaction
          })
          .then(async () => {
            await queryInterface.sequelize.query(
              `TRUNCATE ${LETTER_INPUT_PAGES} CASCADE`,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${LETTER_INPUT_PAGES} and ${LETTER_TYPE_LETTER_INPUT_PAGES} tables. Internal Error: ${error}`
      );
    }
  }
};
