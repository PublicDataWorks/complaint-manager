"use strict";
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";
import { getOfficerFullName } from "../../../sharedUtilities/getFullName";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../../sharedUtilities/constants");
const moment = require("moment");
const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  const CaseOfficer = sequelize.define(
    "case_officer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      officerId: {
        field: "officer_id",
        type: DataTypes.INTEGER,
        references: {
          model: models.officer,
          key: "id"
        },
        allowNull: true
      },
      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      middleName: {
        field: "middle_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      fullName: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "firstName",
          "middleName",
          "lastName",
          "isUnknownOfficer"
        ]),
        get: function () {
          return getOfficerFullName(
            this.get("firstName"),
            this.get("middleName"),
            this.get("lastName"),
            this.get("isUnknownOfficer")
          );
        }
      },
      phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING(10)
      },
      email: {
        field: "email",
        type: DataTypes.STRING
      },
      isUnknownOfficer: {
        type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ["officerId"]),
        get: function () {
          return !this.get("officerId");
        }
      },
      windowsUsername: {
        field: "windows_username",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      supervisorFirstName: {
        field: "supervisor_first_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorMiddleName: {
        field: "supervisor_middle_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorLastName: {
        field: "supervisor_last_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorFullName: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "officerId",
          "supervisorFirstName",
          "supervisorMiddleName",
          "supervisorLastName"
        ]),
        get: function () {
          if (this.get("officerId")) {
            const firstName = this.get("supervisorFirstName")
              ? this.get("supervisorFirstName")
              : "";
            const middleName = this.get("supervisorMiddleName")
              ? this.get("supervisorMiddleName")
              : "";
            const lastName = this.get("supervisorLastName")
              ? this.get("supervisorLastName")
              : "";

            const fullName = `${firstName} ${middleName} ${lastName}`;
            return fullName.replace("  ", " ").trim();
          }

          return "";
        }
      },
      supervisorWindowsUsername: {
        field: "supervisor_windows_username",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      supervisorOfficerNumber: {
        field: "supervisor_officer_number",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      employeeType: {
        field: "employee_type",
        type: DataTypes.ENUM(["Commissioned", "Non-Commissioned", "Recruit"]),
        allowNull: true
      },
      caseEmployeeType: {
        field: "case_employee_type",
        type: DataTypes.STRING,
        validate: {
          isIn: [
            [
              PERSON_TYPE.KNOWN_OFFICER.employeeDescription,
              PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
            ]
          ]
        },
        defaultValue: PERSON_TYPE.KNOWN_OFFICER.employeeDescription,
        allowNull: false
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bureau: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      age: {
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ["dob"]),
        get: function () {
          return moment().diff(this.get("dob"), "years", false);
        }
      },
      endDate: {
        field: "end_date",
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      hireDate: {
        field: "hire_date",
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: true
      },
      race: {
        type: DataTypes.STRING,
        allowNull: true
      },
      workStatus: {
        field: "work_status",
        type: DataTypes.STRING,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        set: function (value) {
          this.setDataValue("notes", sanitize(value));
        }
      },
      roleOnCase: {
        field: "role_on_case",
        type: DataTypes.ENUM([ACCUSED, COMPLAINANT, WITNESS]),
        allowNull: false
      },
      isAnonymous: {
        field: "is_anonymous",
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE
      }
    },
    {
      tableName: "cases_officers",
      paranoid: true,
      hooks: {
        beforeDestroy: async (instance, options) => {
          await instance.sequelize.models.officer_allegation.destroy({
            where: { caseOfficerId: instance.dataValues.id },
            auditUser: options.auditUser,
            transaction: options.transaction
          });

          await instance.sequelize.models.letter_officer.destroy({
            where: { caseOfficerId: instance.dataValues.id },
            auditUser: options.auditUser,
            transaction: options.transaction
          });
        }
      }
    }
  );

  CaseOfficer.prototype.modelDescription = async function (transaction) {
    return [{ "Officer Name": this.fullName }];
  };

  CaseOfficer.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  CaseOfficer.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  CaseOfficer.prototype.emptyCaseOfficerAttributes = function () {
    return {
      officerId: null,
      firstName: null,
      middleName: null,
      lastName: null,
      windowsUsername: null,
      supervisorFirstName: null,
      supervisorMiddleName: null,
      supervisorLastName: null,
      supervisorWindowsUsername: null,
      supervisorOfficerNumber: null,
      caseEmployeeType: PERSON_TYPE.UNKNOWN_OFFICER.employeeDescription,
      employeeType: null,
      district: null,
      bureau: null,
      rank: null,
      dob: null,
      endDate: null,
      hireDate: null,
      sex: null,
      race: null,
      workStatus: null
    };
  };

  CaseOfficer.associate = models => {
    CaseOfficer.hasMany(models.officer_allegation, {
      as: "allegations",
      foreignKey: {
        name: "caseOfficerId",
        field: "case_officer_id"
      },
      cascade: true
    });
    CaseOfficer.belongsTo(models.cases, {
      foreignKey: {
        name: "caseId",
        field: "case_id"
      }
    });
    CaseOfficer.hasOne(models.letter_officer, {
      as: "letterOfficer",
      foreignKey: {
        name: "caseOfficerId",
        field: "case_officer_id"
      }
    });
  };

  CaseOfficer.auditDataChange();
  CaseOfficer.updateCaseStatusAfterCreate();

  return CaseOfficer;
};
