"use strict";
module.exports = (sequelize, DataTypes) => {
  const RecommendedActions = sequelize.define(
    "recommended_action",
    {
      description: {
        allowNull: false,
        type: DataTypes.STRING
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
      }
    },
    { tableName: "recommended_actions" }
  );

  return RecommendedActions;
};
