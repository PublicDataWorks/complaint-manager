"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async () => {
    await loadCsvFromS3("raceEthnicities.csv", models.race_ethnicity);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete("race_ethnicities");
  }
};
