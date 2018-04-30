'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('cases_officers', ['case_id', 'officer_id'], {
        type: 'unique',
        name: 'unique-case-officer-pair'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('cases_officers', 'unique-case-officer-pair')
  }
};
