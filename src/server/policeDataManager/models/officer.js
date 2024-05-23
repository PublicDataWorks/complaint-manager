"use strict";
import { getOfficerFullName } from "../../../sharedUtilities/getFullName";
import models from "./index";

const moment = require("moment/moment");

module.exports = (sequelize, DataTypes) => {
  var Officer = sequelize.define("officer", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
      get: function () {
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
      get: function () {
        return this.get("dob")
          ? moment().diff(this.get("dob"), "years", false)
          : null;
      }
    },
    district: {
      type: DataTypes.STRING
    },
    districtId: {
      type: DataTypes.INTEGER,
      field: "district_id",
      references: {
        model: models.district,
        key: "id"
      }
    },
    bureau: {
      type: DataTypes.STRING
    },
    workStatus: {
      type: DataTypes.STRING,
      field: "work_status"
    },
    supervisorEmployeeId: {
      type: DataTypes.INTEGER,
      field: "supervisor_employee_id"
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
      type: DataTypes.ENUM([
        "Commissioned",
        "Non-Commissioned",
        "Recruit",
        "Civilian"
      ]),
      field: "employee_type"
    },
    employeeId: {
      type: DataTypes.INTEGER,
      field: "employee_id"
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
        name: "supervisorEmployeeId",
        field: "supervisor_employee_id",
        allowNull: true
      },
      targetKey: "employeeId"
    });
    Officer.belongsTo(models.district, {
      as: "officerDistrict",
      foreignKey: {
        name: "districtId",
        field: "district_id",
        allowNull: true
      }
    });
  };
  return Officer;
};
