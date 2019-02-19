"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("officerHistoryOptions.csv", models.officer_history_option);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officer_history_options");
  }
};
