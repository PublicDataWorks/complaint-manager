"use strict";
module.exports = (sequelize, DataTypes) => {
  const PriorityReason = sequelize.define(
    "priority_reasons",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
    {
      tableName: "priority_reasons"
    }
  );

  return PriorityReason;
};
