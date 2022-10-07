module.exports = (sequelize, DataTypes) => {
  const LetterImage = sequelize.define(
    "letterImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      image: {
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
      tableName: "letter_images"
    }
  );

  LetterImage.associate = models => {
    LetterImage.belongsTo(models.letterTypeLetterImage, {
      as: "letterImageId",
      foreignKey: {
        name: "imageId",
        field: "image"
      }
    });
  };

  return LetterImage;
};
