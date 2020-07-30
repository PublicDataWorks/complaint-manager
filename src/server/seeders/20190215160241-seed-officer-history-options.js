"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../complaintManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3(
      "officerHistoryOptions.csv",
      models.officer_history_option
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officer_history_options");
  }
};
