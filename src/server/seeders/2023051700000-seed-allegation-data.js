"use strict";
import updateSeedAllegationDataFromS3 from "../seeder_jobs/updateSeedAllegationDataFromS3";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await updateSeedAllegationDataFromS3("allegations.csv");
  },
  down: async (queryInterface, Sequelize) => {
    console.log("I am actively doing nothing. No deleting here!!!");
  }
};
