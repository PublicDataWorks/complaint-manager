'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('civilians', 'case_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'cases',
                key: 'id'
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('civilians', 'case_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'cases',
                key: 'id'
            },
        })
    }
};
