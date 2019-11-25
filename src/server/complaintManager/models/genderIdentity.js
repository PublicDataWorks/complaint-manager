"use strict";

module.exports = (sequelize, DataTypes) => {
  const GenderIdentities = sequelize.define(
    "gender_identity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
    {
      tableName: "gender_identities"
    }
  );
  return GenderIdentities;
};
