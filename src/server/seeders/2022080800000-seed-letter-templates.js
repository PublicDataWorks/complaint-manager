"use strict";
const fs = require("fs");

const referralLetterTemplate = fs.readFileSync(
  `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
);
const referralLetterEditableTemplate = fs.readFileSync(
  `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
);
const REFERRAL_LETTER_TEMPLATE_QUERY = `UPDATE letter_types
  SET template = '${referralLetterTemplate.toString().replace(/'/g, "''")}',
    editable_template = 
    '${referralLetterEditableTemplate.toString().replace(/'/g, "''")}'
  WHERE type = 'REFERRAL'`;

const complainantLetterTemplate = fs.readFileSync(
  `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
);
const COMPLAINANT_LETTER_TEMPLATE_QUERY = `UPDATE letter_types
  SET template = '${complainantLetterTemplate.toString().replace(/'/g, "''")}'
  WHERE type = 'COMPLAINANT'`;

const REVERSION_QUERY = `UPDATE letter_types
  SET template = '',
    editable_template = NULL
  WHERE type = 'REFERRAL'
    OR type = 'COMPLAINANT'`;

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(REFERRAL_LETTER_TEMPLATE_QUERY, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              COMPLAINANT_LETTER_TEMPLATE_QUERY,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
      );
    }
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(REVERSION_QUERY, { transaction });
    });
  }
};
