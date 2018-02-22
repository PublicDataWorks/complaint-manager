'use strict';
module.exports = (sequelize, DataTypes) => {
    const Civilian = sequelize.define('civilian', {
            firstName: {
                field: 'first_name',
                type: DataTypes.STRING(25)
            },
            lastName: {
                field: 'last_name',
                type: DataTypes.STRING(25)
            },
            birthDate: {
                field: 'birth_date',
                type: DataTypes.DATEONLY
            },
            roleOnCase: {
                field: 'role_on_case',
                type: DataTypes.ENUM(['Primary Complainant', 'Witness']),
                defaultValue: 'Primary Complainant'
            },
            genderIdentity: {
                field: 'gender_identity',
                type: DataTypes.ENUM(['Male', 'Female', 'Trans Male', 'Trans Female', 'Other', 'No Answer'])
            },
            raceEthnicity: {
                field: 'race_ethnicity',
                type: DataTypes.STRING
            },
            phoneNumber: {
                field: 'phone_number',
                type: DataTypes.DECIMAL(10, 0)
            },
            email: {
                field: 'email',
                type: DataTypes.STRING
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
    }

    return Civilian;
};