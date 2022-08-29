const nextStatusMap = {
  INITIAL: "Active",
  ACTIVE: "Letter in Progress",
  LETTER_IN_PROGRESS: "Ready for Review",
  READY_FOR_REVIEW: "Ready for Review",
  FORWARDED_TO_AGENCY: "Forwarded to Agency",
  CLOSED: "Closed"
};

module.exports = (sequelize, DataTypes) => {
  const CaseStatus = sequelize.define(
    "caseStatus",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orderKey: {
        type: DataTypes.INTEGER,
        field: "order_key",
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
    },
    {
      tableName: "case_statuses"
    }
  );

  CaseStatus.prototype.associate = models => {
    CaseStatus.hasMany(models.cases, {
      as: "currentStatus",
      foreignKey: {
        name: "currentStatusId",
        field: "current_status_id",
        allowNull: false
      }
    });
  };

  return CaseStatus;
};
