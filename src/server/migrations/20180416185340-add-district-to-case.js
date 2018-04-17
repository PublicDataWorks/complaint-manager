'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('cases', 'district', {
            type: Sequelize.STRING,
            allowNull: true
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('cases', 'district')
    }
};
