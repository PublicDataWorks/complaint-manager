module.exports = (sequelize, DataTypes) => {
  const PersonType = sequelize.define(
    "personType",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      employeeDescription: {
        type: DataTypes.STRING,
        field: "employee_description"
      },
      isEmployee: {
        type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ["employeeDescription"]),
        get: function () {
          return !!this.get("employeeDescription");
        }
      },
      abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      legend: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dialogAction: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "dialog_action"
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        field: "is_default"
      },
      subTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        field: "sub_types"
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
      tableName: "person_types"
    }
  );

  return PersonType;
};
