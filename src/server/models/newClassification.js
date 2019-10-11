"use strict";

module.exports = (sequelize, DataTypes) => {
  const Classifications = sequelize.define(
    "new_classifications",
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
      tableName: "new_classifications"
    }
  );

  Classifications.associate = models => {
    Classifications.hasMany(models.case_classification, {
      as: "caseClassification",
      foreignKey: {
        name: "newClassificationId",
        field: "new_classification_id",
        allowNull: false
      }
    });
  };

  return Classifications;
};
