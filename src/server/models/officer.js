"use strict";
import { getOfficerFullName } from "./modelUtilities/getFullName";

const moment = require("moment/moment");

module.exports = (sequelize, DataTypes) => {
  var Officer = sequelize.define("officer", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    officerNumber: {
      type: DataTypes.INTEGER,
      field: "officer_number"
    },
    firstName: {
      type: DataTypes.STRING,
      field: "first_name"
    },
    middleName: {
      type: DataTypes.STRING,
      field: "middle_name"
    },
    lastName: {
      type: DataTypes.STRING,
      field: "last_name"
    },
    fullName: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, [
        "firstName",
        "middleName",
        "lastName"
      ]),
      get: function() {
        return getOfficerFullName(
          this.get("firstName"),
          this.get("middleName"),
          this.get("lastName")
        );
      }
    },
    rank: {
      type: DataTypes.STRING
    },
    race: {
      type: DataTypes.STRING
    },
    sex: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATEONLY
    },
    age: {
      type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ["dob"]),
      get: function() {
        return moment().diff(this.get("dob"), "years", false);
      }
    },
    bureau: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING,
      get() {
        switch (this.getDataValue("district")) {
          case "First District":
            return "1st District";
          case "Second District":
            return "2nd District";
          case "Third District":
            return "3rd District";
          case "Fourth District":
            return "4th District";
          case "Fifth District":
            return "5th District";
          case "Sixth District":
            return "6th District";
          case "Seventh District":
            return "7th District";
          case "Eighth District":
            return "8th District";
          default:
            return this.getDataValue("district");
        }
      }
    },
    workStatus: {
      type: DataTypes.STRING,
      field: "work_status"
    },
    supervisorOfficerNumber: {
      type: DataTypes.INTEGER,
      field: "supervisor_officer_number"
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      field: "hire_date"
    },
    endDate: {
      type: DataTypes.DATEONLY,
      field: "end_date"
    },
    employeeType: {
      type: DataTypes.ENUM(["Commissioned", "Non-Commissioned", "Recruit"]),
      field: "employee_type"
    },
    windowsUsername: {
      type: DataTypes.INTEGER,
      field: "windows_username"
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at"
    }
  });

  Officer.associate = models => {
    Officer.belongsToMany(models.cases, {
      through: models.case_officer,
      foreignKey: {
        name: "officerId",
        field: "officer_id",
        allowNull: true
      }
    });
    Officer.belongsTo(models.officer, {
      as: "supervisor",
      foreignKey: {
        name: "supervisorOfficerNumber",
        field: "supervisor_officer_number",
        allowNull: true
      },
      targetKey: "officerNumber"
    });
  };
  return Officer;
};
