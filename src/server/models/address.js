'use strict';
module.exports = (sequelize, DataTypes) => {
    var Address = sequelize.define('address', {
        streetAddress: {
            type: DataTypes.STRING,
            field: 'street_address'
        },

        streetAddress2: {
            type: DataTypes.STRING,
            field: 'street_address2'
        },

        city: {
            type: DataTypes.STRING,
            field: 'city'
        },

        state: {
            type: DataTypes.STRING,
            field: 'state'
        },

        zipCode: {
            type: DataTypes.STRING,
            field: 'zip_code'
        },
        country: {
            type: DataTypes.STRING,
            field: 'country'
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE
        }
    });

    return Address;
};