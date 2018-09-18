"use strict";

module.exports = (sequelize, DataTypes) => {
  const Classification = sequelize.define(
    "classification",
    {
      abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );

  return Classification;
};
