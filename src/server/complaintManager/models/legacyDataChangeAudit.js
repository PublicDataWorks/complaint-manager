"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "legacy_data_change_audit",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      caseId: {
        allowNull: true,
        field: "case_id",
        type: DataTypes.INTEGER
      },
      modelName: {
        allowNull: false,
        field: "model_name",
        type: DataTypes.STRING
      },
      modelDescription: {
        field: "model_description",
        type: DataTypes.JSONB
      },
      modelId: {
        allowNull: false,
        field: "model_id",
        type: DataTypes.INTEGER
      },
      snapshot: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      action: {
        allowNull: false,
        type: DataTypes.STRING
      },
      changes: {
        allowNull: false,
        type: DataTypes.JSONB
      },
      user: {
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE
      }
    },
    {}
  );
};
