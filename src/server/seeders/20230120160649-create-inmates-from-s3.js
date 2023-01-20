"use strict";
const createSeedInmateDataFromS3 = require("../seeder_jobs/createSeedInmateDataFromS3");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "HAWAII") {
      await createSeedInmateDataFromS3();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE cases_inmates SET inmate_id = NULL WHERE inmate_id IS NOT NULL"
    );
    await queryInterface.bulkDelete("inmates");
  }
};
