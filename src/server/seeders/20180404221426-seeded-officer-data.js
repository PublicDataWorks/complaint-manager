'use strict';



module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('officers', [
            {
                officerNumber: 200,
                firstName: 'Ugochi',
                middleName: 'Grant',
                lastName: 'Smith',
                rank: 'Police Commander',
                race: 'Cuban',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'First District',
                workStatus: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            },{
                officerNumber: 300,
                firstName: 'Phillip',
                middleName: 'Devon',
                lastName: 'Andrew',
                rank: 'Police Commander',
                race: 'Cuban',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'First District',
                workStatus: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            },{
                officerNumber: 124,
                firstName: 'Andrew',
                middleName: null,
                lastName: 'Jackson',
                rank: 'Police Lieutenant',
                race: 'Black',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Seventh District',
                workStatus: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            },{
                officerNumber: 456,
                firstName: 'Stephanie',
                middleName: null,
                lastName: 'Wallace',
                rank: 'Police Lieutenant',
                race: 'Black',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Seventh District',
                workStatus: 'Active',
                createdAt: new Date(),
                updatedAt: new Date()
            },{
                officerNumber: 567,
                firstName: 'Peter',
                middleName: 'Phillip',
                lastName: 'Piper',
                rank: 'Police Officer 1',
                race: 'Black',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Fifth District',
                workStatus: 'Retired',
                createdAt: new Date(),
                updatedAt: new Date()
            },{
                officerNumber: 1039,
                firstName: 'Jennifer',
                middleName: 'Genesis',
                lastName: 'Mendoza',
                rank: 'Police Officer 1',
                race: 'White',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Fifth District',
                workStatus: 'Terminated',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('officers')
    }
};
