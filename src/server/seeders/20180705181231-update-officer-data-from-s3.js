"use strict";

const createSeedOfficerDataFromS3 = require("../seeder_jobs/createSeedOfficerDataFromS3");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createSeedOfficerDataFromS3();
  },

  down: (queryInterface, Sequelize) => {}
};
