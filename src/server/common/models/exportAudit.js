"use strict";
module.exports = (sequelize, DataTypes) => {
  const ExportAudit = sequelize.define(
    "export_audit",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      exportType: {
        field: "export_type",
        allowNull: false,
        type: DataTypes.STRING
      },
      rangeType: {
        field: "range_type",
        allowNull: true,
        type: DataTypes.STRING
      },
      rangeStart: {
        field: "range_start",
        allowNull: true,
        type: DataTypes.STRING
      },
      rangeEnd: {
        field: "range_end",
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      tableName: "export_audits",
      timestamps: false
    }
  );

  ExportAudit.associate = models => {
    ExportAudit.belongsTo(models.audit, {
      as: "exportAudit",
      foreignKey: { name: "auditId", field: "audit_id" }
    });
  };

  return ExportAudit;
};
