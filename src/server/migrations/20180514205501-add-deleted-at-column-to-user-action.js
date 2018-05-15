'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('user_actions', 'deleted_at',{
            type: Sequelize.DATE,
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('user_actions', 'deleted_at')
    }
};
