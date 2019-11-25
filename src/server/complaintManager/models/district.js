"use strict";

module.exports = (sequelize, DataTypes) => {
  const Districts = sequelize.define(
    "district",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "districts"
    }
  );
  return Districts;
};
