"use strict";

let UPDATE_REFERRAL_LETTER;
if (process.env.ORG === "NOIPM") {
  const {
    RECIPIENT,
    RECIPIENT_ADDRESS
  } = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterDefaults`);

  UPDATE_REFERRAL_LETTER = `UPDATE letter_types 
  SET default_recipient = '${RECIPIENT}',
    default_recipient_address = '${RECIPIENT_ADDRESS}'
  WHERE "type" = 'REFERRAL'
`;
}

const UPDATE_COMPLAINANT_LETTER = `UPDATE letter_types 
  SET default_recipient = '{eachComplainant}',
    default_recipient_address = '{eachComplainantAddress}'
  WHERE "type" = 'COMPLAINANT'`;

const UPDATE_CANNOT_HELP_LETTER = `UPDATE letter_types
  SET default_recipient = '{primaryComplainant}',
    default_recipient_address = '{primaryComplainantAddress}'
  WHERE "type" = 'CAN''T HELP'
`;

const NULL_LETTER_TYPES = `UPDATE letter_types SET default_recipient = NULL, default_recipient_address = NULL`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        if (process.env.ORG === "NOIPM") {
          await queryInterface.sequelize.query(UPDATE_REFERRAL_LETTER, {
            transaction
          });
          await queryInterface.sequelize.query(UPDATE_COMPLAINANT_LETTER, {
            transaction
          });
        } else {
          await queryInterface.sequelize.query(UPDATE_CANNOT_HELP_LETTER, {
            transaction
          });
        }
      });
    } catch (error) {
      throw new Error(
        `Error while seeding and update of letter types to include has_edit_page and requires_approval ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(NULL_LETTER_TYPES, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while nullifying default recipient data tables. Internal Error: ${error}`
      );
    }
  }
};
