"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("heardAboutSourceSeedData.csv", models.heard_about_source);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("heard_about_sources");
  }
};
