'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('cases', [{
            'first_name': 'Salvador',
            'last_name': 'Ariza',
            'created_at': new Date(),
            'updated_at': new Date()
        }, {
            'first_name': 'Lily',
            'last_name': 'Evans',
            'created_at': new Date(),
            'updated_at': new Date()
        }])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('cases', {
            'first_name': {
                $in: ['Salvador', 'Lily']
            }
        })
    }
}
