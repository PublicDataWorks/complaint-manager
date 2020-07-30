"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("raceEthnicities.csv", models.race_ethnicity);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("race_ethnicities");
  }
};
