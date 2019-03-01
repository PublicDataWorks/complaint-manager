"use strict";

module.exports = (sequelize, DataTypes) => {
  const InitialDiscoverySource = sequelize.define(
    "initial_discovery_source",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: "initial_discovery_sources" }
  );

  return InitialDiscoverySource;
};
