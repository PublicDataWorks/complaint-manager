"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("intakeSources.csv", models.intake_source);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE cases SET intake_source_id = NULL WHERE intake_source_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("intake_sources");
  }
};
