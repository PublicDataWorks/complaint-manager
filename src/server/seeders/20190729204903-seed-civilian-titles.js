"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("civilianTitles.csv", models.civilian_title);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("civilian_titles");
  }
};
