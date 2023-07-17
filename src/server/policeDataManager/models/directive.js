"use strict";
module.exports = (sequelize, DataTypes) => {
  const Directive = sequelize.define(
    "directive",
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
        type: DataTypes.DATE,
        field: "created_at"
      },

      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    {
      tableName: "directives"
    }
  );

  return Directive;
};
