'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cases', [{
      firstName: 'Ed',
      lastName: 'Thome',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Brian',
      lastName: 'Sayler',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cases', {
      firstName: {
        $in: ['Ed', 'Brian']
      }
    });
  }
}
