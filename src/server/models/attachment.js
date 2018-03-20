'use strict';
module.exports = (sequelize, DataTypes) => {
    const attachment = sequelize.define('attachment', {
        fileName: {
            field: 'file_name',
            type: DataTypes.STRING
        },
        description: {
            field: 'description',
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
    });

    attachment.associate = (models) => {
        attachment.belongsTo(models.cases, {foreignKey: {name: 'caseId', field: 'case_id', allowNull: false}})
    }

    return attachment;
};