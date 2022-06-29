module.exports = (sequelize, DataTypes) => {
  const LetterInputPages = sequelize.define("letter_input_pages", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "key"
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
  });

  return LetterInputPages;
};
