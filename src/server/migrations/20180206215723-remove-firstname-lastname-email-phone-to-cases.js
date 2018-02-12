'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return [
          await queryInterface.removeColumn('cases', 'first_name'),
          await queryInterface.removeColumn('cases', 'last_name'),
          await queryInterface.removeColumn('cases', 'email'),
          await queryInterface.removeColumn('cases', 'phone_number')
      ]
  },

  down: async (queryInterface, Sequelize) => {
      return [
          await queryInterface.addColumn('cases', 'first_name'),
          await queryInterface.addColumn('cases', 'last_name'),
          await queryInterface.addColumn('cases', 'email'),
          await queryInterface.addColumn('cases', 'phone_number')
      ]
  }
};
