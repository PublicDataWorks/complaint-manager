"use strict";
module.exports = (sequelize, DataTypes) => {
  const DataAccessValue = sequelize.define(
    "data_access_value",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      association: {
        allowNull: false,
        type: DataTypes.STRING
      },
      fields: {
        allowNull: false,
        type: DataTypes.JSONB
      }
    },
    {
      tableName: "data_access_values",
      timestamps: false
    }
  );

  DataAccessValue.associate = models => {
    DataAccessValue.belongsTo(models.data_access_audit, {
      as: "dataAccessValues",
      foreignKey: {
        name: "dataAccessAuditId",
        field: "data_access_audit_id",
        allowNull: false
      }
    });
  };

  return DataAccessValue;
};
