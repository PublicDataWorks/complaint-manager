"use strict";
const createSeedOfficerDataFromS3 = require("../seeder_jobs/createSeedOfficerDataFromS3");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createSeedOfficerDataFromS3();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE cases_officers SET officer_id = NULL WHERE officer_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("officers");
    await queryInterface.sequelize.query(
      "ALTER SEQUENCE IF EXISTS officers_id_seq START 1 RESTART 1 MINVALUE 1"
    );
  }
};
