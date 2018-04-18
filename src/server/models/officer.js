'use strict';
const moment = require("moment/moment");

module.exports = (sequelize, DataTypes) => {
    var Officer = sequelize.define('officer', {
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
            type: DataTypes.STRING,
            get() {
                switch(this.getDataValue('district')) {
                    case 'First District':
                        return '1st District';
                    case 'Second District':
                        return '2nd District';
                    case 'Third District':
                        return '3rd District';
                    case 'Fourth District':
                        return '4th District';
                    case 'Fifth District':
                        return '5th District';
                    case 'Sixth District':
                        return '6th District';
                    case 'Seventh District':
                        return '7th District';
                    case 'Eighth District':
                        return '8th District';
                    default:
                        return this.getDataValue('district');
                }
            }
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
            getterMethods: {
                fullName() {
                    return `${this.firstName} ${this.middleName} ${this.lastName}`.replace("  ", " ")
                },
                age() {
                    return moment().diff(this.dob, 'years', false)
                }
            },
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });

    Officer.associate = (models) => {
        Officer.belongsToMany(models.cases, {
            through: models.case_officer,
            foreignKey: {
                name: 'officerId',
                field: 'officer_id',
                allowNull: false
            }
        })
    }
    return Officer;
};