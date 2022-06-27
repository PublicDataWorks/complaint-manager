"use strict";

const LETTER_TYPES_TABLE = "letter_types";
const CASE_STATUSES_TABLE = "case_statuses";

const INSERT_REFERRAL_FOREIGN_KEY = `
  UPDATE ${LETTER_TYPES_TABLE}
  SET required_status = (
    SELECT id FROM ${CASE_STATUSES_TABLE}
    WHERE name = 'Active'
  )
  WHERE TYPE = 'REFERRAL'
`;

const INSERT_COMPLAINANT_FOREIGN_KEY = `
  UPDATE ${LETTER_TYPES_TABLE}
  SET required_status = (
    SELECT id FROM ${CASE_STATUSES_TABLE}
    WHERE name = 'Ready for Review'
  )
  WHERE TYPE = 'COMPLAINANT'
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_REFERRAL_FOREIGN_KEY, {
          transaction
        });
      });
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_COMPLAINANT_FOREIGN_KEY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding foreign key data from ${CASE_STATUSES_TABLE} to ${LETTER_TYPES_TABLE}. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `TRUNCATE ${LETTER_TYPES_TABLE} CASCADE`,
        {
          transaction
        }
      );
    });
  }
};
