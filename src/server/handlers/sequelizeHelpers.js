import sequelize from "sequelize";

export const caseInsensitiveSort = (attributeName, model) => {
  return sequelize.fn(
    "lower",
    sequelize.col(model.rawAttributes[attributeName].field)
  );
};
