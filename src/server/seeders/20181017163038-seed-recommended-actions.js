"use strict";
const loadCsvFromS3 = require("../seeder_jobs/loadCsvFromS3");
const models = require("../policeDataManager/models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsvFromS3("recommendedActions.csv", models.recommended_action);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "referral_letter_officer_recommended_actions"
    );
    await queryInterface.bulkDelete("recommended_actions");
    await queryInterface.sequelize.query(
      "ALTER SEQUENCE IF EXISTS recommended_actions_id_seq START 1 RESTART 1 MINVALUE 1"
    );
  }
};
