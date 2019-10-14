"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await loadCsv("genderIdentities.csv", models.gender_identity);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("gender_identity");
  }
};
