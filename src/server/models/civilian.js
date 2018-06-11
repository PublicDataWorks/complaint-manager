"use strict";
const { COMPLAINANT, WITNESS } = require("../../sharedUtilities/constants");

module.exports = (sequelize, DataTypes) => {
  const Civilian = sequelize.define(
    "civilian",
    {
      firstName: {
        field: "first_name",
        type: DataTypes.STRING(25)
      },
      middleInitial: {
        field: "middle_initial",
        type: DataTypes.STRING(1)
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING(25)
      },
      suffix: {
        field: "suffix",
        type: DataTypes.STRING(25)
      },
      birthDate: {
        field: "birth_date",
        type: DataTypes.DATEONLY
      },
      roleOnCase: {
        field: "role_on_case",
        type: DataTypes.ENUM([COMPLAINANT, WITNESS]),
        defaultValue: COMPLAINANT
      },
      genderIdentity: {
        field: "gender_identity",
        type: DataTypes.ENUM([
          "Male",
          "Female",
          "Trans Male",
          "Trans Female",
          "Other",
          "Unknown"
        ])
      },
      raceEthnicity: {
        field: "race_ethnicity",
        type: DataTypes.STRING
      },
      phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING(10)
      },
      email: {
        field: "email",
        type: DataTypes.STRING
      },
      additionalInfo: {
        field: "additional_info",
        type: DataTypes.TEXT
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
      paranoid: true,
      getterMethods: {
        fullName() {
          let { firstName, middleInitial, lastName, suffix } = this;
          middleInitial = middleInitial ? middleInitial + "." : "";

          const allNames = [firstName, middleInitial, lastName, suffix];

          const existingNames = allNames.filter(name => Boolean(name));

          return existingNames.reduce(
            (accumulator, currentName, currentIndex) => {
              if (currentName) {
                accumulator += currentName;
              }

              if (currentIndex !== existingNames.length - 1) {
                accumulator += " ";
              }

              return accumulator;
            },
            ""
          );
        }
      }
    }
  );

  Civilian.prototype.modelDescription = async function(transaction) {
    return this.fullName;
  };

  Civilian.prototype.getCaseId = async function(transaction) {
    return this.caseId;
  };

  Civilian.associate = models => {
    Civilian.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });
    Civilian.hasOne(models.address, {
      foreignKey: { name: "addressableId", field: "addressable_id" },
      scope: {
        addressable_type: "civilian"
      }
    });
  };

  Civilian.auditDataChange();

  return Civilian;
};
