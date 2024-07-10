module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    "facility",
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
      abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING
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
    { table_name: "facilities" }
  );
  Facility.associate = models => {
    Facility.hasMany(models.housing_unit, {
      as: "housingUnits",
      foreignKey: {
        name: "facilityId",
        field: "facility_id"
      },
    });
  }
  return Facility;
};
