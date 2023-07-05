"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "NOIPM") {
      await queryInterface.sequelize.query(
        "UPDATE allegations SET deleted_at = NOW() WHERE deleted_at IS NULL"
      );
      await loadCsvFromS3("newAllegations.csv", models.allegation);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        "DELETE FROM allegations WHERE deleted_at IS NULL",
        transaction
      );
      await queryInterface.sequelize.query(
        "UPDATE allegations SET deleted_at = NULL WHERE deleted_at IS NOT NULL",
        transaction
      );
    });
  }
};
