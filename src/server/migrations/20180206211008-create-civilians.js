'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('civilians', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            case_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'cases',
                    key: 'id'
                },
            },
            first_name: {
                type: Sequelize.STRING(25)
            },
            middle_initial: {
                type: Sequelize.STRING(1)
            },
            last_name: {
                type: Sequelize.STRING(25)
            },
            suffix: {
                type: Sequelize.STRING(25)
            },
            birth_date: {
                allowNull: true,
                type: Sequelize.DATEONLY
            },
            role_on_case: {
                type: Sequelize.ENUM(['Complainant', 'Witness'])
            },
            gender_identity: {
                type: Sequelize.ENUM(['Male', 'Female', 'Trans Male', 'Trans Female', 'Other', 'Unknown'])
            },
            race_ethnicity: {
                type: Sequelize.STRING
            },
            phone_number: {
                type: Sequelize.STRING(10)
            },
            email: {
                type: Sequelize.STRING(100)
            },
            additional_info: {
                type: Sequelize.TEXT
            },
            created_at: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('civilians');
    }
};