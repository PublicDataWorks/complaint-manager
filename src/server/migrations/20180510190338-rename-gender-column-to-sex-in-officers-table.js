'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('officers', 'gender', 'sex')

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('officers', 'sex', 'gender')
    }
};