"use strict";
module.exports = (sequelize, DataTypes) => {
  const ActionAudit = sequelize.define("action_audit", {
    action: {
      field: "action",
      type: DataTypes.STRING,
      allowNull: false
    },
    auditType: {
      field: "audit_type",
      type: DataTypes.STRING,
      allowNull: false
    },
    user: {
      field: "user",
      type: DataTypes.STRING,
      allowNull: false
    },
    caseId: {
      field: "case_id",
      type: DataTypes.INTEGER
    },
    subject: {
      type: DataTypes.STRING
    },
    subjectDetails: {
      field: "subject_details",
      type: DataTypes.JSONB
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

  ActionAudit.associate = models => {
    ActionAudit.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  return ActionAudit;
};
