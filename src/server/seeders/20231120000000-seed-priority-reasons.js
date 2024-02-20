"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "HAWAII") {
      await loadCsvFromS3("priorityReasons.csv", models.priority_reasons);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE cases SET priority_reason_id = NULL WHERE priority_reason_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("priority_reasons");
  }
};
