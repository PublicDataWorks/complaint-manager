"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("raceEthnicitiesSeedData.csv", models.race_ethnicity);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("race_ethnicities");
  }
};
