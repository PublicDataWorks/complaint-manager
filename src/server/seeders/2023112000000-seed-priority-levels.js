"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("priorityLevels.csv", models.priority_levels);
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.sequelize.query(
    //   "UPDATE cases SET priority_level_id = NULL WHERE priority_level_id IS NOT NULL"
    // );
    await queryInterface.bulkDelete("priority_levels");
  }
};
