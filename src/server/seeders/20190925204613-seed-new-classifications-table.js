"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("classificationOptions.csv", models.new_classifications);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("new_classification");
  }
};
