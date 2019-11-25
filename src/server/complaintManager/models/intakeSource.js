"use strict";

module.exports = (sequelize, DataTypes) => {
  const IntakeSources = sequelize.define(
    "intake_source",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: "intake_sources" }
  );

  return IntakeSources;
};
