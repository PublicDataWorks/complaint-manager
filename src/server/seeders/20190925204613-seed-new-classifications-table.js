"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("classificationOptions.csv", models.classification);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("classifications");
  }
};
