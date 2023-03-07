module.exports = (sequelize, DataTypes) => {
  const LetterSettings = sequelize.define(
    "letterSettings",
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      format: {
        type: DataTypes.STRING
      },
      width: {
        type: DataTypes.STRING
      },
      height: {
        type: DataTypes.STRING
      },
      border: {
        type: DataTypes.STRING
      },
      headerHeight: {
        type: DataTypes.STRING,
        field: "header_height"
      },
      footerHeight: {
        type: DataTypes.STRING,
        field: "footer_height"
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
      tableName: "letter_settings"
    }
  );

  return LetterSettings;
};
