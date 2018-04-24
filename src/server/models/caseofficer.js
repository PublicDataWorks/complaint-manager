'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseOfficer = sequelize.define('case_officer', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            notes: {
                type: DataTypes.TEXT,
            },
            roleOnCase: {
                field: 'role_on_case',
                type: DataTypes.ENUM(['AccusedOfficer'])
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'cases_officers'
        }
    )

    return CaseOfficer
}