'use strict';

module.exports = (sequelize, DataTypes) => {
    const DataChangeAudit = sequelize.define('data_change_audit', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        caseId: {
            allowNull: false,
            field: 'case_id',
            type: DataTypes.INTEGER
        },
        modelName: {
            allowNull: false,
            field: 'model_name',
            type: DataTypes.STRING
        },
        modelId: {
            allowNull: false,
            field: 'model_id',
            type: DataTypes.INTEGER
        },
        snapshot: {
            allowNull: false,
            type: DataTypes.JSONB
        },
        action: {
            allowNull: false,
            type: DataTypes.STRING
        },
        changes: {
            allowNull: false,
            type: DataTypes.JSONB
        },
        user: {
            allowNull: false,
            type: DataTypes.STRING
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE
        },
    }, {});
    return DataChangeAudit;
};