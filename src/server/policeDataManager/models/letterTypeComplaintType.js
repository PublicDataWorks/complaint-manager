module.exports = (sequelize, DataTypes) => {
  const LetterTypeComplaintType = sequelize.define(
    "letterTypeComplaintType",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      letterTypeId: {
        type: DataTypes.INTEGER,
        field: "letter_type_id",
        allowNull: false
      },
      complaintTypeId: {
        type: DataTypes.INTEGER,
        field: "complaint_type_id",
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
      tableName: "letter_type_complaint_type"
    }
  );

  return LetterTypeComplaintType;
};
