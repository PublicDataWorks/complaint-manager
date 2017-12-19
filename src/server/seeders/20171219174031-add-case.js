'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cases', [{
      firstName: 'Salvador',
      lastName: 'Ariza',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Lily',
      lastName: 'Evans',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cases', {
      firstName: {
        $in: ['Salvador', 'Lily']
      }
    });
  }
};
