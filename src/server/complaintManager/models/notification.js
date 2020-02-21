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
      previewText: {
        allowNull: false,
        type: DataTypes.STRING
      },
      hasBeenRead: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        field: "created_at",
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        field: "updated_at",
        type: DataTypes.DATE
      },
      deleted_at: {
        field: "deleted_at",
        type: DataTypes.DATE
      }
    },
    { paranoid: true }
  );

  Notification.associate = models => {
    Notification.belongsTo(models.cases, {
      foreignKey: {
        name: "caseId",
        field: "case_id",
        allowNull: false
      }
    });
  };
  return Notification;
};
