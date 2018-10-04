"use strict";
const { ALLEGATION_SEVERITY } = require("../../sharedUtilities/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      if (process.env.NODE_ENV !== "production") {
        const queryAddSeverityToEmptyRows = `UPDATE officers_allegations set severity = '${
          ALLEGATION_SEVERITY.MEDIUM
        }' where severity IS NULL;`;
        await queryInterface.sequelize.query(queryAddSeverityToEmptyRows, {
          transaction
        });
      }

      const querySeverityNotNull = `ALTER TABLE "officers_allegations" ALTER COLUMN "severity" SET NOT NULL;`;
      return await queryInterface.sequelize.query(querySeverityNotNull, {
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    const querySeverityAllowNull = `ALTER TABLE "officers_allegations" ALTER COLUMN "severity" DROP NOT NULL;`;
    return await queryInterface.sequelize.query(querySeverityAllowNull);
  }
};
