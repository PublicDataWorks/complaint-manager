"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("intakeSourceSeedData.csv", models.intake_source);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("intake_sources");
  }
};
