"use strict";
module.exports = (sequelize, DataTypes) => {
  const ActionAudit = sequelize.define("action_audit", {
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

  ActionAudit.associate = models => {
    ActionAudit.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  return ActionAudit;
};
