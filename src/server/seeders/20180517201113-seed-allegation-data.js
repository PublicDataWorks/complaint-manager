"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("allegations.csv", models.allegation);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("allegations");
  }
};
