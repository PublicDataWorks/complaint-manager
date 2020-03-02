const models = "./";

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

  Notification.associate = models => {
    Notification.belongsTo(models.case_note, {
      foreignKey: {
        name: "caseNoteId",
        field: "case_note_id",
        allowNull: false
      }
    });
  };

  Notification.prototype.getCaseNoteId = async function(transaction) {
    return this.caseNoteId;
  };

  return Notification;
};
