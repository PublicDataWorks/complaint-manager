"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("civilianTitles.csv", models.civilian_title);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE civilians SET civilian_title_id = NULL WHERE civilian_title_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("civilian_titles");
  }
};
