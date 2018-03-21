'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'civilians',
            'additional_info',
            {
                type: Sequelize.TEXT
            })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('civilians', 'additional_info')
    }
}