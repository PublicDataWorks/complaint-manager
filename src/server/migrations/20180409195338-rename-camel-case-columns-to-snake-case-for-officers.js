'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('officers', 'officerNumber', 'officer_number')
        await queryInterface.renameColumn('officers', 'firstName', 'first_name')
        await queryInterface.renameColumn('officers', 'middleName', 'middle_name')
        await queryInterface.renameColumn('officers', 'lastName', 'last_name')
        await queryInterface.renameColumn('officers', 'workStatus', 'work_status')
        await queryInterface.renameColumn('officers', 'createdAt', 'created_at')
        await queryInterface.renameColumn('officers', 'updatedAt', 'updated_at')
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('officers', 'officer_number', 'officerNumber')
        await queryInterface.renameColumn('officers', 'first_name', 'firstName')
        await queryInterface.renameColumn('officers', 'middle_name', 'middleName')
        await queryInterface.renameColumn('officers', 'last_name', 'lastName')
        await queryInterface.renameColumn('officers', 'work_status', 'workStatus')
        await queryInterface.renameColumn('officers', 'created_at', 'createdAt')
        await queryInterface.renameColumn('officers', 'updated_at', 'updatedAt')
    }
};
