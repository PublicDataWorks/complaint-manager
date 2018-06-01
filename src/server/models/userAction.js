module.exports = (sequelize, DataTypes) => {
  const UserAction = sequelize.define(
    "user_action",
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
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      actionTakenAt: {
        type: DataTypes.DATE,
        field: "action_taken_at",
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING(255)
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
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE
      }
    },
    {
      paranoid: true
    }
  );

  UserAction.associate = models => {
    UserAction.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });
  };

  UserAction.auditDataChange();

  return UserAction;
};
