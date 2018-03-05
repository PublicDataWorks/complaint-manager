'use strict';
module.exports = (sequelize, DataTypes) => {
  const attachment = sequelize.define('attachment', {
    key: DataTypes.STRING
  });

  attachment.associate = (models) => {
    attachment.belongsTo(models.cases, {foreignKey: {name: 'caseId', field: 'case_id', allowNull: false}})
  }

  return attachment;
};