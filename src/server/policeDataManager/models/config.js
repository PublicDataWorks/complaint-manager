module.exports = (sequelize, DataTypes) => {
  const Signer = sequelize.define(
    "config",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      value: {
        type: DataTypes.STRING,
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
      tableName: "configs"
    }
  );

  return Signer;
};
