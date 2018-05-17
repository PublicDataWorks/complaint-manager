"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cases_officers");
    await queryInterface.bulkDelete("officers");
    await loadCsv("officerSeedData.csv", models.officer);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cases_officers");
    await queryInterface.bulkDelete("officers");
  }
};
