const models = "./";
module.exports = (sequelize, DataTypes) => {
  const LetterTypeLetterInputPages = sequelize.define(
    "letter_type_letter_input_pages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      }
    }
  );
  LetterTypeLetterInputPages.associate = function (models) {
    LetterTypeLetterInputPages.belongsTo(models.letter_type, {
      as: "letterType",
      foreignKey: {
        name: "letterTypeId",
        field: "letter_type_id"
      }
    });
    LetterTypeLetterInputPages.belongsTo(models.letter_input_pages, {
      as: "letterInputPages",
      foreignKey: {
        name: "letterInputPagesId",
        field: "letter_input_pages_id"
      }
    });
  };
  return LetterTypeLetterInputPages;
};
