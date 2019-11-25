/* 
****** This model should stay in the code base even after the
  newAuditFeature is removed 
 */

"use strict";

module.exports = (sequelize, DataTypes) => {
  const LegacyDataAccessAudit = sequelize.define(
    "legacy_data_access_audit",
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
      },
      auditDetails: {
        field: "audit_details",
        type: DataTypes.JSONB
      }
    },
    {
      tableName: "legacy_data_access_audits",
      timestamps: false
    }
  );

  LegacyDataAccessAudit.associate = models => {
    LegacyDataAccessAudit.belongsTo(models.audit, {
      as: "legacyDataAccessAudit",
      foreignKey: { name: "auditId", field: "audit_id" }
    });
  };

  return LegacyDataAccessAudit;
};
