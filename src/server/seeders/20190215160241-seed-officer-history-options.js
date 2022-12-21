"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3(
      "officerHistoryOptions.csv",
      models.officer_history_option
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE letter_officers SET officer_history_option_id = NULL WHERE officer_history_option_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("officer_history_options");
    await queryInterface.sequelize.query(
      "ALTER SEQUENCE IF EXISTS officer_history_options_id_seq START 1 RESTART 1 MINVALUE 1"
    );
  }
};
