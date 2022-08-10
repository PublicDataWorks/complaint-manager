"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async () => {
    await loadCsvFromS3("civilianTitles.csv", models.civilian_title);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete("civilian_titles");
  }
};
