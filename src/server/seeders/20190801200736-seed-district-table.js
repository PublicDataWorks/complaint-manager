"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("districts.csv", models.district);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `UPDATE officers SET district_id = NULL WHERE district_id IS NOT NULL`
    );
    await queryInterface.sequelize.query(
      "UPDATE cases SET district_id = NULL WHERE district_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("districts");
  }
};
