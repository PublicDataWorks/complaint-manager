"use strict";
import {
  ADDRESSABLE_TYPE,
  COMPLAINANT,
  WITNESS
} from "../../../sharedUtilities/constants";
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";
import { getCivilianFullName } from "../../../sharedUtilities/getFullName";

module.exports = (sequelize, DataTypes) => {
  const Civilian = sequelize.define(
    "civilian",
    {
      firstName: {
        field: "first_name",
        type: DataTypes.STRING(25),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("firstName", sanitize(value));
          }
        }
      },
      middleInitial: {
        field: "middle_initial",
        type: DataTypes.STRING(1),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("middleInitial", sanitize(value));
          }
        }
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING(25),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("lastName", sanitize(value));
          }
        }
      },
      suffix: {
        field: "suffix",
        type: DataTypes.STRING(25),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("suffix", sanitize(value));
          }
        }
      },
      fullName: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "firstName",
          "lastName",
          "middleInitial",
          "suffix"
        ]),
        get: function () {
          return getCivilianFullName(
            this.get("firstName"),
            this.get("middleInitial"),
            this.get("lastName"),
            this.get("suffix")
          );
        }
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
      phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING(10)
      },
      email: {
        field: "email",
        type: DataTypes.STRING,
        set: function (value) {
          if (value !== null) {
            this.setDataValue("email", sanitize(value));
          }
        }
      },
      additionalInfo: {
        field: "additional_info",
        type: DataTypes.TEXT,
        set: function (value) {
          if (value !== null) {
            this.setDataValue("additionalInfo", sanitize(value));
          }
        }
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
      paranoid: true,
      hooks: {
        beforeSave: (civilian, options) => {
          civilian.firstName = civilian.firstName?.trim();
          civilian.lastName = civilian.lastName?.trim();
        }
      }
    }
  );

  Civilian.prototype.modelDescription = async function (transaction) {
    return [{ "Civilian Name": this.fullName }];
  };

  Civilian.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  Civilian.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  Civilian.associate = models => {
    Civilian.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });
    Civilian.hasOne(models.address, {
      foreignKey: { name: "addressableId", field: "addressable_id" },
      scope: {
        addressable_type: ADDRESSABLE_TYPE.CIVILIAN
      }
    });
    Civilian.belongsTo(models.race_ethnicity, {
      as: "raceEthnicity",
      foreignKey: {
        name: "raceEthnicityId",
        field: "race_ethnicity_id",
        allowNull: true
      }
    });
    Civilian.belongsTo(models.gender_identity, {
      as: "genderIdentity",
      foreignKey: {
        name: "genderIdentityId",
        field: "gender_identity_id",
        allowNull: true
      }
    });
    Civilian.belongsTo(models.civilian_title, {
      as: "civilianTitle",
      foreignKey: {
        name: "civilianTitleId",
        field: "civilian_title_id",
        allowNull: true
      }
    });
  };

  Civilian.auditDataChange();
  Civilian.updateCaseStatusAfterCreate();
  Civilian.updateCaseStatusAfterUpdate();
  Civilian.updateCaseStatusAfterDestroy();

  return Civilian;
};
