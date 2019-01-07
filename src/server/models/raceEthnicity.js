"use strict";

module.exports = (sequelize, DataTypes) => {
  const RaceEthnicities = sequelize.define(
    "race_ethnicity",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "race_ethnicities"
    }
  );
  return RaceEthnicities;
};
