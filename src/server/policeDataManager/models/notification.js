module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "notification",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hasBeenRead: {
        field: "has_been_read",
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: DataTypes.DATE
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE
      }
    },
    { paranoid: true }
  );

  Notification.prototype.modelDescription = async function(transaction) {
    return [{ "Notification Mentioned User": this.user }];
  };

  Notification.prototype.getManagerType = async function(transaction) {
    return "complaint";
  };

  Notification.prototype.getCaseId = async function(transaction) {
    const caseNote = await sequelize
      .model("case_note")
      .findByPk(this.caseNoteId, { transaction });

    return caseNote.caseId;
  };

  Notification.associate = models => {
    Notification.belongsTo(models.case_note, {
      as: "caseNote",
      foreignKey: {
        name: "caseNoteId",
        field: "case_note_id",
        allowNull: false
      }
    });
  };

  Notification.auditDataChange();
  return Notification;
};
