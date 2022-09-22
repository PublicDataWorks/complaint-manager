module.exports = (sequelize, DataTypes) => {
  const LetterType = sequelize.define("letter_types", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editableTemplate: {
      type: DataTypes.STRING,
      field: "editable_template",
      allowNull: true
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      field: "requires_approval",
      allowNull: true
    },
    hasEditPage: {
      type: DataTypes.BOOLEAN,
      field: "has_edit_page",
      allowNull: true
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

  LetterType.associate = models => {
    LetterType.belongsTo(models.signers, {
      as: "defaultSender",
      foreignKey: {
        field: "default_sender",
        name: "defaultSenderId",
        allowNull: false
      }
    });

    LetterType.hasMany(models.letterField, {
      as: "fields",
      foreignKey: { name: "letterType", field: "letter_type" }
    });

    LetterType.belongsTo(models.caseStatus, {
      as: "requiredStatus",
      foreignKey: {
        name: "requiredStatusId",
        field: "required_status",
        allowNull: true
      }
    });
  };

  LetterType.prototype.toPayload = letterType => {
    let result = letterType.toJSON();
    delete result.requiredStatusId;
    delete result.defaultSenderId;
    delete result.updatedAt;
    delete result.createdAt;
    if (result.requiredStatus) {
      result.requiredStatus = result.requiredStatus.name;
    }

    if (result.defaultSender) {
      delete result.defaultSender.createdAt;
      delete result.defaultSender.updatedAt;
    }

    return result;
  };

  return LetterType;
};
