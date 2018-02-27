'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.addColumn('civilians', 'middle_initial', {
                type: Sequelize.STRING(1)
            }),
            await queryInterface.addColumn('civilians', 'suffix', {
                type: Sequelize.STRING(25)
            })
        ]
    },
    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.removeColumn('civilians', 'middle_initial'),
            await queryInterface.removeColumn('civilians', 'suffix')
        ]
    }
}
