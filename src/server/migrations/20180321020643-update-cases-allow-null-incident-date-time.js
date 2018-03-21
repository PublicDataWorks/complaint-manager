'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn(
          'cases',
          'incident_date',
          {
              allowNull: true,
              type: Sequelize.DATE,
          }
      )
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn(
          'cases',
          'incident_date',
          {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: moment(Date.now()).format('YYYY-MM-DDTHH:mm')
          }
      )
  }
};
