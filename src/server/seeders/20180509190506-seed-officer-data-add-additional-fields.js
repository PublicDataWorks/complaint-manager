'use strict';
const loadOfficersFromCsv = require('../seeder_jobs/loadOfficersFromCsv');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('cases_officers');
        await queryInterface.bulkDelete('officers');
        await loadOfficersFromCsv('officerSeedData.csv');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('cases_officers');
        await queryInterface.bulkDelete('officers');
    }
};