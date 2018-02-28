'use strict';
const moment = require("moment")

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cases', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            complainant_type:{
                allowNull: false,
                type: Sequelize.ENUM(
                    'Civilian', 'Police Officer'
                ),
                defaultValue: 'Civilian'
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM(
                    'Initial', 'Active', 'Forwarded', 'Suspended', 'Complete'
                ),
                defaultValue: 'Initial'
            },
            first_contact_date:{
                allowNull: false,
                type: Sequelize.DATEONLY,
                defaultValue: moment(Date.now()).format('YYYY-MM-DD')
            },
            narrative:{
                type: Sequelize.TEXT
            },
            created_by:{
                allowNull: false,
                type: Sequelize.STRING
            },
            assigned_to:{
                allowNull: false,
                type: Sequelize.STRING
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
        return queryInterface.dropTable('cases');
    }
};