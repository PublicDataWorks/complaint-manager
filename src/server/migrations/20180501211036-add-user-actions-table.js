'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user_actions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            case_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'cases',
                    key: 'id'
                }
            },
            user: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            action_taken_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            notes: {
                type: Sequelize.STRING(255),
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_actions')
    }
};
