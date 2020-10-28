"use strict";

module.exports = (sequelize, DataTypes) => {
  const Classification = sequelize.define(
    "classification",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "classifications"
    }
  );

  Classification.associate = models => {
    Classification.hasMany(models.case_classification, {
      as: "caseClassification",
      foreignKey: {
        name: "classificationId",
        field: "classification_id",
        allowNull: false
      }
    });
  };

  return Classification;
};
