"use strict";
const createSeedOfficerDataFromS3 = require("../seeder_jobs/createSeedOfficerDataFromS3");

module.exports = {
  up: async () => {
    await createSeedOfficerDataFromS3();
  },

  down: () => {
    return Promise.resolve();
  }
};
