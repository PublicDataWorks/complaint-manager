"use strict";
module.exports = (sequelize, DataTypes) => {
  const DataChangeAudit = sequelize.define(
    "data_change_audit",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      modelName: {
        allowNull: false,
        field: "model_name",
        type: DataTypes.STRING
      },
      modelDescription: {
        field: "model_description",
        type: DataTypes.JSONB
      },
      modelId: {
        allowNull: false,
        field: "model_id",
        type: DataTypes.INTEGER
      },
      snapshot: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      changes: {
        allowNull: false,
        type: DataTypes.JSONB
      }
    },
    {
      tableName: "data_change_audits",
      timestamps: false
    }
  );

  DataChangeAudit.associate = models => {
    DataChangeAudit.belongsTo(models.audit, {
      as: "dataChangeAudit",
      foreignKey: { name: "auditId", field: "audit_id" }
    });
  };

  return DataChangeAudit;
};
