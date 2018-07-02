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
    caseId: {
      field: "case_id",
      type: DataTypes.INTEGER
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
