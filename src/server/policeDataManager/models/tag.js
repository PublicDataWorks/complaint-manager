module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("tag", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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

  Tag.prototype.modelDescription = function () {
    return [{ "New Tag Name": this.name }];
  };
  Tag.prototype.getCaseId = function () {
    return null;
  };

  // TODO if tags are used in both managers should they not return a specific manager type?
  Tag.prototype.getManagerType = function () {
    return "complaint";
  };

  Tag.associate = models => {
    Tag.hasMany(models.case_tag, {
      foreignKey: { name: "tagId", field: "tag_id" }
    });
  };

  Tag.auditDataChange();

  return Tag;
};
