"use strict";
module.exports = (sequelize, DataTypes) => {
  const DataAccessAudit = sequelize.define(
    "data_access_audit",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      auditSubject: {
        field: "audit_subject",
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: "data_access_audits",
      timestamps: false
    }
  );

  DataAccessAudit.associate = models => {
    DataAccessAudit.belongsTo(models.audit, {
      as: "dataAccessAudit",
      foreignKey: { name: "auditId", field: "audit_id" }
    });
    DataAccessAudit.hasMany(models.data_access_value, {
      as: "dataAccessValues",
      foreignKey: {
        name: "dataAccessAuditId",
        field: "data_access_audit_id"
      }
    });
  };

  return DataAccessAudit;
};
