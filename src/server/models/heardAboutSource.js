"use strict";

module.exports = (sequelize, DataTypes) => {
  const HeardAboutSource = sequelize.define(
    "heard_about_source",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: "heard_about_sources" }
  );

  return HeardAboutSource;
};
