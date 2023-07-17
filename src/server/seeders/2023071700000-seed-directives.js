"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "NOIPM") {
      await loadCsvFromS3("directives.csv", models.directive);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `UPDATE officers_allegations SET directive = NULL WHERE directive IS NOT NULL`,
        { transaction }
      );
      await queryInterface.bulkDelete("directives", undefined, {
        transaction
      });
    });
  }
};
