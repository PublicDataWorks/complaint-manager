"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("recommendedActionSeedData.csv", models.recommended_action);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("recommended_actions");
  }
};
