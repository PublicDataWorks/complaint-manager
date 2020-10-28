module.exports = (sequelize, DataTypes) => {
  const CaseTag = sequelize.define("case_tag", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false
    }
  });

  CaseTag.prototype.modelDescription = async function(transaction) {
    const tag = await sequelize.model("tag").findByPk(this.tagId, {
      transaction: transaction
    });

    return [{ "Tag Name": tag.name }];
  };

  CaseTag.prototype.getCaseId = async function() {
    return this.caseId;
  };

  CaseTag.prototype.getManagerType = async function() {
    return "complaint";
  };

  CaseTag.associate = models => {
    CaseTag.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });

    CaseTag.belongsTo(models.tag, {
      foreignKey: { name: "tagId", field: "tag_id", allowNull: false }
    });
  };

  CaseTag.auditDataChange();

  return CaseTag;
};
