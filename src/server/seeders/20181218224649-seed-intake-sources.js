"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async () => {
    await loadCsvFromS3("intakeSources.csv", models.intake_source);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete("intake_sources");
  }
};
