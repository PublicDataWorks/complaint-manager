"use strict";
module.exports = (sequelize, DataTypes) => {
  const FileAudit = sequelize.define(
    "file_audit",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fileType: {
        field: "file_type",
        allowNull: false,
        type: DataTypes.STRING
      },
      fileName: {
        field: "file_name",
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      tableName: "file_audits",
      timestamps: false
    }
  );

  FileAudit.associate = models => {
    FileAudit.belongsTo(models.audit, {
      as: "fileAudit",
      foreignKey: { name: "auditId", field: "audit_id" }
    });
  };
  return FileAudit;
};
