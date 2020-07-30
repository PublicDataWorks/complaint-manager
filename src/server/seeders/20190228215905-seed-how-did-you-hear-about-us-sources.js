"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3(
      "howDidYouHearAboutUsSources.csv",
      models.how_did_you_hear_about_us_source
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("how_did_you_hear_about_us_sources");
  }
};
