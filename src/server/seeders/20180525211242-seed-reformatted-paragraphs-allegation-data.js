"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("allegations");
    await loadCsv("allegationSeedData.csv", models.allegation);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("allegations");
  }
};
