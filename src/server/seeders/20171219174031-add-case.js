'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('cases', [{
            'first_name': 'Salvador',
            'last_name': 'Ariza',
            'created_at': new Date(),
            'updated_at': new Date(),
            'email': 'sal@me.com',
            'phone_number': 1234567890,
            'complainant_type': 'Civilian'

        }, {
            'first_name': 'Lily',
            'last_name': 'Evans',
            'created_at': new Date(),
            'updated_at': new Date(),
            'email': 'levans@me.com',
            'phone_number': 9876543210,
            'complainant_type': 'Civilian'
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
