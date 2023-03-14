"use strict";

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../../sharedUtilities/constants");
const {
  getOfficerFullName,
  getPersonFullName
} = require("../../../sharedUtilities/getFullName");
const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  const CaseInmate = sequelize.define(
    "caseInmate",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      inmateId: {
        field: "inmate_id",
        type: DataTypes.STRING,
        references: {
          model: models.inmate,
          key: "id"
        },
        allowNull: true
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
      firstName: {
        type: DataTypes.STRING,
        field: "first_name"
      },
      middleInitial: {
        type: DataTypes.STRING,
        field: "middle_initial"
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name"
      },
      fullName: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "firstName",
          "middleInitial",
          "lastName",
          "suffix"
        ]),
        get: function () {
          return getPersonFullName(
            this.get("firstName"),
            this.get("middleInitial"),
            this.get("lastName"),
            this.get("suffix"),
            "Person in Custody"
          );
        }
      },
      suffix: {
        type: DataTypes.STRING
      },
      notFoundInmateId: {
        type: DataTypes.STRING,
        field: "not_found_inmate_id"
      },
      facility: {
        type: DataTypes.STRING
      },
      notes: {
        type: DataTypes.STRING
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
      tableName: "cases_inmates",
      paranoid: true
    }
  );

  CaseInmate.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  CaseInmate.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  CaseInmate.prototype.modelDescription = async function (transaction) {
    return [{ "Person in Custody ID": this.inmateId }];
  };

  CaseInmate.associate = models => {
    CaseInmate.belongsTo(models.cases, {
      foreignKey: {
        name: "caseId",
        field: "case_id"
      }
    });
    CaseInmate.belongsTo(models.inmate, {
      foreignKey: {
        name: "inmateId",
        field: "inmate_id"
      }
    });
  };

  CaseInmate.auditDataChange();
  CaseInmate.updateCaseStatusAfterCreate();

  return CaseInmate;
};
