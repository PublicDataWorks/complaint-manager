"use strict";
module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define("attachment", {
    fileName: {
      field: "file_name",
      type: DataTypes.STRING
    },
    description: {
      field: "description",
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

  Attachment.prototype.modelDescription = async function(transaction) {
    return [{ "File Name": this.fileName }];
  };

  Attachment.prototype.getCaseId = async function(transaction) {
    return this.caseId;
  };

  Attachment.associate = models => {
    Attachment.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });
  };

  Attachment.auditDataChange();
  Attachment.updateCaseStatusAfterCreate();

  return Attachment;
};
