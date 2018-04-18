'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cases_officers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            case_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'cases',
                    key: 'id'
                },
            },
            officer_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'officers',
                    key: 'id'
                }
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('cases_officers');
    }
};