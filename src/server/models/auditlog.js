"use strict";
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define("audit_log", {
    action: {
      field: "action",
      type: DataTypes.STRING
    },
    user: {
      field: "user",
      type: DataTypes.STRING
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE
    }
  });

  AuditLog.associate = models => {
    AuditLog.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  return AuditLog;
};
