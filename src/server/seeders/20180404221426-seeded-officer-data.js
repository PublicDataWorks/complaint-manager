'use strict';



module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('officers', [
            {
                officer_number: 200,
                first_name: 'Ugochi',
                middle_name: 'Grant',
                last_name: 'Smith',
                rank: 'Police Commander',
                race: 'Cuban',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'First District',
                work_status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },{
                officer_number: 300,
                first_name: 'Phillip',
                middle_name: 'Devon',
                last_name: 'Andrew',
                rank: 'Police Commander',
                race: 'Cuban',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'First District',
                work_status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },{
                officer_number: 124,
                first_name: 'Andrew',
                middle_name: null,
                last_name: 'Jackson',
                rank: 'Police Lieutenant',
                race: 'Black',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Seventh District',
                work_status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },{
                officer_number: 456,
                first_name: 'Stephanie',
                middle_name: null,
                last_name: 'Wallace',
                rank: 'Police Lieutenant',
                race: 'Black',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Seventh District',
                work_status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
            },{
                officer_number: 567,
                first_name: 'Peter',
                middle_name: 'Phillip',
                last_name: 'Piper',
                rank: 'Police Officer 1',
                race: 'Black',
                gender: 'Male',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Fifth District',
                work_status: 'Retired',
                created_at: new Date(),
                updated_at: new Date()
            },{
                officer_number: 1039,
                first_name: 'Jennifer',
                middle_name: 'Genesis',
                last_name: 'Mendoza',
                rank: 'Police Officer 1',
                race: 'White',
                gender: 'Female',
                dob: new Date(),
                bureau: 'FOB - Field Operations Bureau',
                district: 'Fifth District',
                work_status: 'Terminated',
                created_at: new Date(),
                updated_at: new Date()
            },
        ])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('officers')
    }
};
