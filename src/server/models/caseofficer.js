'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseOfficer = sequelize.define('case_officer', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
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