module.exports = (sequelize, DataTypes) => {
  const LetterField = sequelize.define(
    "letterField",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      field: {
        type: DataTypes.STRING,
        allowNull: false
      },
      relation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        field: "is_required",
        allowNull: false
      },
      isForBody: {
        type: DataTypes.BOOLEAN,
        field: "is_for_body",
        allowNull: false
      },
      sortBy: {
        type: DataTypes.STRING,
        field: "sort_by"
      },
      sortDirection: {
        type: DataTypes.STRING,
        field: "sort_direction"
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
    { tableName: "letter_fields" }
  );
  LetterField.associate = models => {
    LetterField.belongsTo(models.letter_types, {
      as: "letterType",
      foreignKey: { field: "letter_type", allowNull: false }
    });
  };

  return LetterField;
};
