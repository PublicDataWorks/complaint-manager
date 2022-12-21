"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3(
      "howDidYouHearAboutUsSources.csv",
      models.how_did_you_hear_about_us_source
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE cases SET how_did_you_hear_about_us_source_id = NULL WHERE how_did_you_hear_about_us_source_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("how_did_you_hear_about_us_sources");
  }
};
