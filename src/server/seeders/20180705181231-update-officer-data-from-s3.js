"use strict";

const updateOfficerDataFromS3 = require("../seeder_jobs/updateOfficerDataFromS3");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await updateOfficerDataFromS3();
  },

  down: (queryInterface, Sequelize) => {}
};
