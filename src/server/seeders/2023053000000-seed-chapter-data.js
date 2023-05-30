"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "NOIPM") {
      await loadCsvFromS3("chapters.csv", models.ruleChapter);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `UPDATE officers_allegations SET chapter = NULL WHERE chapter IS NOT NULL`,
        { transaction }
      );
      await queryInterface.bulkDelete("rule_chapters", undefined, {
        transaction
      });
    });
  }
};
