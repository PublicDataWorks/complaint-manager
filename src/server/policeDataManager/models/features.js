module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define("feature_toggles", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isDev: {
      field: "is_dev",
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return Feature;
};
