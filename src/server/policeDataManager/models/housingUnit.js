module.exports = (sequelize, DataTypes) => {
  const HousingUnit = sequelize.define(
    "housing_unit",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    { table_name: "housing_units" }
  );

  return HousingUnit;
};
