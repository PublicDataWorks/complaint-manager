"use strict";

const createSeedOfficerDataFromS3 = require("../seeder_jobs/createSeedOfficerDataFromS3");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.resolve();
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
