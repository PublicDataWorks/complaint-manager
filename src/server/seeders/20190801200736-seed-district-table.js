"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("districts.csv", models.district);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("districts");
  }
};
