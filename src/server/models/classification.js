"use strict";

module.exports = (sequelize, DataTypes) => {
  const Classification = sequelize.define(
    "classification",
    {
      abbreviation: DataTypes.STRING,
      name: DataTypes.STRING
    },
    {}
  );

  return Classification;
};
