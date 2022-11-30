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

  ComplaintType.associate = models => {
    ComplaintType.belongsToMany(models.letter_types, {
      through: models.letterTypeComplaintType,
      as: "letterTypes",
      foreignKey: { name: "complaintTypeId", field: "complaint_type_id" }
    });
  };

  return ComplaintType;
};
