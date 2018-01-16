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
            'incident_type': 'Citizen Complaint'

        }, {
            'first_name': 'Lily',
            'last_name': 'Evans',
            'created_at': new Date(),
            'updated_at': new Date(),
            'email': 'levans@me.com',
            'phone_number': 9876543210,
            'incident_type': 'Officer Complaint'
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
