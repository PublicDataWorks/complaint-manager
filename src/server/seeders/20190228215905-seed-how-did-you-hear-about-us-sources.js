"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv(
      "howDidYouHearAboutUsSourceSeedData.csv",
      models.how_did_you_hear_about_us_source
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("how_did_you_hear_about_us_sources");
  }
};
