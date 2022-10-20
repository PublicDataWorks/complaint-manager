module.exports = (sequelize, DataTypes) => {
  const ComplaintType = sequelize.define(
    "complaintTypes",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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
      tableName: "complaint_types"
    }
  );

  return ComplaintType;
};
