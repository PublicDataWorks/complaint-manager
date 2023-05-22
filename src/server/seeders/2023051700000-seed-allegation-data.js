"use strict";
import updateSeedAllegationDataFromS3 from "../seeder_jobs/updateSeedAllegationDataFromS3";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await updateSeedAllegationDataFromS3("allegations.csv");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officers_allegations");
    await queryInterface.bulkDelete("allegations");
    await queryInterface.sequelize.query(
      "ALTER SEQUENCE IF EXISTS allegations_id_seq START 1 RESTART 1 MINVALUE 1"
    );
  }
};
