'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cases', 'narrative', {
        type: Sequelize.TEXT
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cases', 'narrative');
  }
};