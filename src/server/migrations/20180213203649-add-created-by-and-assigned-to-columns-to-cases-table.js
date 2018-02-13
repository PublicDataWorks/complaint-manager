'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.addColumn('cases', 'created_by', {
                allowNull: false,
                type: Sequelize.STRING
            }),
            await queryInterface.addColumn('cases', 'assigned_to', {
                allowNull: false,
                type: Sequelize.STRING
            })
        ]
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.removeColumn('cases', 'created_by'),
            await queryInterface.removeColumn('cases', 'assigned_to')
        ]
    }
};
