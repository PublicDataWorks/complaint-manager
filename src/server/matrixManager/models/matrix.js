export default (sequelize, DataTypes) => {
  const Matrix = sequelize.define("matrices", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pibControlNumber: {
      field: "pib_control_number",
      type: DataTypes.STRING,
      allowNull: false
    },
    firstReviewer: {
      field: "first_reviewer",
      type: DataTypes.STRING,
      allowNull: false
    },
    secondReviewer: {
      field: "second_reviewer",
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE
    },
    deletedAt: {
      field: "deleted_at",
      type: DataTypes.DATE,
      as: "deletedAt"
    }
  });
  return Matrix;
};
