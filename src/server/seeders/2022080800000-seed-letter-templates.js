"use strict";
const fs = require("fs");

let REFERRAL_LETTER_TEMPLATE_QUERY, COMPLAINANT_LETTER_TEMPLATE_QUERY;
if (process.env.ORG === "NOIPM") {
  const referralLetterTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
  );
  const referralLetterEditableTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
  );
  REFERRAL_LETTER_TEMPLATE_QUERY = `UPDATE letter_types
  SET template = '${referralLetterTemplate.toString().replace(/'/g, "''")}',
    editable_template = '${referralLetterEditableTemplate
      .toString()
      .replace(/'/g, "''")}'
  WHERE type = 'REFERRAL'`;

  const complainantLetterTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
  );
  COMPLAINANT_LETTER_TEMPLATE_QUERY = `UPDATE letter_types
  SET template = '${complainantLetterTemplate.toString().replace(/'/g, "''")}'
  WHERE type = 'COMPLAINANT'`;
}

let CANNOT_HELP_LETTER_TEMPLATE_QUERY;
if (process.env.ORG === "HAWAII") {
  const cannotHelpLetterTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/cannotHelpLetter.tpl`
  );
  const cannotHelpLetterBodyTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/cannotHelpLetterBody.tpl`
  );

  CANNOT_HELP_LETTER_TEMPLATE_QUERY = `UPDATE letter_types
  SET template = '${cannotHelpLetterTemplate.toString().replace(/'/g, "''")}',
    editable_template = '${cannotHelpLetterBodyTemplate
      .toString()
      .replace(/'/g, "''")}'
  WHERE type = 'CAN''T HELP'
`;
}

const REVERSION_QUERY = `UPDATE letter_types
  SET template = '',
    editable_template = NULL
  WHERE type = 'REFERRAL'
    OR type = 'COMPLAINANT'
    OR type = 'CAN''T HELP'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        if (process.env.ORG === "NOIPM") {
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
        } else {
          await queryInterface.sequelize.query(
            CANNOT_HELP_LETTER_TEMPLATE_QUERY,
            { transaction }
          );
        }
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(REVERSION_QUERY, { transaction });
    });
  }
};
