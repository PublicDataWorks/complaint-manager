const { QUERY_TYPES } = require("../../../sharedUtilities/constants");

module.exports = (sequelize, DataTypes) => {
  const PublicDataVisualization = sequelize.define(
    "publicDataVisualization",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      queryType: {
        type: DataTypes.STRING,
        field: "query_type",
        validate: {
          isIn: Object.keys(QUERY_TYPES)
        }
      },
      collapsedText: {
        type: DataTypes.STRING,
        field: "collapsed_text",
        allowNull: false
      },
      fullMessage: {
        type: DataTypes.STRING,
        field: "full_message"
      },
      orderKey: {
        type: DataTypes.INTEGER,
        field: "order_key",
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false
      }
    },
    {
      tableName: "public_data_visualizations"
    }
  );

  return PublicDataVisualization;
};
