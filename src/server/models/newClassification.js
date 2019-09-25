"use strict";

module.exports = (sequelize, DataTypes) => {
  const Classifications = sequelize.define(
    "new_classifications",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "new_classifications"
    }
  );
  return Classifications;
};
