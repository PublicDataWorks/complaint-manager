const moment = require("moment");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cases', 'first_contact_date', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: moment()
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('cases', 'first_contact_date')
  }
};
