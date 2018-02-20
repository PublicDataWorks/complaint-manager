'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('audit_logs', 'user', {
            type: Sequelize.STRING,
            allowNull: false
        })
        await queryInterface.changeColumn('audit_logs', 'action', {
            type: Sequelize.STRING,
            allowNull: false
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('audit_logs', 'user', {
            type: Sequelize.STRING,
        })
        await queryInterface.changeColumn('audit_logs', 'action', {
            type: Sequelize.STRING,
        })
    }
}
