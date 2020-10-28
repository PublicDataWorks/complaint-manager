"use strict";

module.exports = (sequelize, DataTypes) => {
  const OfficerHistoryOption = sequelize.define(
    "officer_history_option",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: "officer_history_options" }
  );
  return OfficerHistoryOption;
};
