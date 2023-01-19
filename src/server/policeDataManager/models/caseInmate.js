"use strict";

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../../sharedUtilities/constants");
const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  const CaseInmate = sequelize.define(
    "case_inmate",
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
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        field: "updated_at",
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

  CaseInmate.associate = models => {
    CaseInmate.belongsTo(models.cases, {
      foreignKey: {
        name: "caseId",
        field: "case_id"
      }
    });
  };

  CaseInmate.auditDataChange();
  CaseInmate.updateCaseStatusAfterCreate();

  return CaseInmate;
};
