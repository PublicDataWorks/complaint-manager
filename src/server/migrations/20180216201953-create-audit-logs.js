'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('audit_logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            action: {
                allowNull: false,
                type: Sequelize.STRING
            },
            user: {
                allowNull: false,
                type: Sequelize.STRING
            },
            case_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'cases',
                    key: 'id'
                },
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
        return queryInterface.dropTable('audit_logs');
    }
};