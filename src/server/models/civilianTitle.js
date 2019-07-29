"use strict";

module.exports = (sequelize, DataTypes) => {
  const CivilianTitles = sequelize.define(
    "civilian_title",
    {
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
