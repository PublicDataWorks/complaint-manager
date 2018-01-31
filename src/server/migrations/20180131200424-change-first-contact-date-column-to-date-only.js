const moment = require("moment")

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('cases', 'first_contact_date', {
            allowNull: false,
            type: Sequelize.DATEONLY,
            defaultValue: new Date()
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('cases', 'first_contact_date', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new moment()
        })
    }
};
