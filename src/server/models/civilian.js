'use strict';
module.exports = (sequelize, DataTypes) => {
    const Civilian = sequelize.define('civilian', {
            firstName: {
                field: 'first_name',
                type: DataTypes.STRING(25)
            },
            middleInitial: {
                field: 'middle_initial',
                type: DataTypes.STRING(1)
            },
            lastName: {
                field: 'last_name',
                type: DataTypes.STRING(25)
            },
            suffix: {
                field: 'suffix',
                type: DataTypes.STRING(25)
            },
            birthDate: {
                field: 'birth_date',
                type: DataTypes.DATEONLY
            },
            roleOnCase: {
                field: 'role_on_case',
                type: DataTypes.ENUM(['Complainant', 'Witness']),
                defaultValue: 'Complainant'
            },
            genderIdentity: {
                field: 'gender_identity',
                type: DataTypes.ENUM(['Male', 'Female', 'Trans Male', 'Trans Female', 'Other', 'Unknown'])
            },
            raceEthnicity: {
                field: 'race_ethnicity',
                type: DataTypes.STRING
            },
            phoneNumber: {
                field: 'phone_number',
                type: DataTypes.STRING(10)
            },
            email: {
                field: 'email',
                type: DataTypes.STRING
            },
            additionalInfo: {
                field: 'additional_info',
                type: DataTypes.TEXT
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE
            }
        }
    );

    Civilian.associate = (models) => {
        Civilian.belongsTo(models.cases, {foreignKey: {name: 'caseId', field: 'case_id', allowNull: false}});
        Civilian.belongsTo(models.address, {foreignKey: {name: 'addressId', field: 'address_id', allowNull: true}})
    }

    return Civilian;
};