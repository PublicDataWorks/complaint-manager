"use strict";

module.exports = (sequelize, DataTypes) => {
  const CivilianTitles = sequelize.define(
    "civilian_title",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "civilian_titles"
    }
  );
  return CivilianTitles;
};
