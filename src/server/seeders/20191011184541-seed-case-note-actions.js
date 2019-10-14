"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await loadCsv("caseNoteActionSeedData.csv", models.case_note_action);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("case_note_action");
  }
};
