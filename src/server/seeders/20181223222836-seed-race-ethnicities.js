"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("raceEthnicities.csv", models.race_ethnicity);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE civilians SET race_ethnicity_id = NULL WHERE race_ethnicity_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("race_ethnicities");
  }
};
