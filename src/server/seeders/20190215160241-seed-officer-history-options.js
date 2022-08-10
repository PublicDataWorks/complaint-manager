"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async () => {
    await loadCsvFromS3(
      "officerHistoryOptions.csv",
      models.officer_history_option
    );
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete("officer_history_options");
  }
};
