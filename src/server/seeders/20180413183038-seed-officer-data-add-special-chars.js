"use strict";
const loadOfficersFromCsv = require("../seeder_jobs/loadOfficersFromCsv");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officers");
    await loadOfficersFromCsv("officerSeedData.csv");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("officers");
  }
};
