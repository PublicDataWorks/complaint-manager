import models from "./index";

module.exports = (sequelize, DataTypes) => {
  const CaseClassification = sequelize.define(
    "case_classification",
    {
      caseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "case_id",
        references: {
          model: models.cases,
          key: "id"
        }
      },
      newClassificationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "new_classification_id",
        references: {
          model: models.new_classifications,
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at"
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at"
      }
    },
    { tableName: "case_classifications", paranoid: true }
  );

  CaseClassification.associate = models => {
    CaseClassification.belongsTo(models.new_classifications, {
      as: "new_classification",
      foreignKey: {
        name: "newClassificationId",
        field: "new_classification_id",
        allowNull: false
      }
    });
  };

  return CaseClassification;
};
