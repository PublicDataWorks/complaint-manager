'use strict';
module.exports = (sequelize, DataTypes) => {
    var officer = sequelize.define('officer', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        officerNumber: {
            type: DataTypes.INTEGER,
            field: 'officer_number'
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'first_name'
        },
        middleName: {
            type: DataTypes.STRING,
            field: 'middle_name'
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'last_name'
        },
        rank: {
            type: DataTypes.STRING
        },
        race: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.STRING
        },
        dob: {
            type: DataTypes.DATEONLY
        },
        bureau: {
            type: DataTypes.STRING
        },
        district: {
            type: DataTypes.STRING
        },
        workStatus: {
            type: DataTypes.STRING,
            field: 'work_status'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return officer;
};