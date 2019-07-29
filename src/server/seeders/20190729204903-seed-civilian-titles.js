"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("civilianTitles.csv", models.civilian_title);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("civilian_titles");
  }
};
