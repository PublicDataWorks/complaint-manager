module.exports = (sequelize, DataTypes) => {
  const LetterTypeLetterImage = sequelize.define(
    "letterTypeLetterImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      imageId: {
        type: DataTypes.INTEGER,
        field: "image_id",
        allowNull: false
      },
      letterId: {
        type: DataTypes.INTEGER,
        field: "letter_id",
        allowNull: false
      },
      maxWidth: {
        type: DataTypes.STRING,
        field: "max_width"
      },
      name: {
        type: DataTypes.STRING
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
      tableName: "letter_types_letter_images"
    }
  );

  return LetterTypeLetterImage;
};
