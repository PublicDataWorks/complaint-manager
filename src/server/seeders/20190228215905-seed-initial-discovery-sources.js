"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await loadCsv("initialDiscoverySourceSeedData.csv", models.initial_discovery_source);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("initial_discovery_sources");
  }
};
