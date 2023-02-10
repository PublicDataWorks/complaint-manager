"use strict";
import { getOfficerFullName } from "../../../sharedUtilities/getFullName";
import models from "./index";

const moment = require("moment/moment");

module.exports = (sequelize, DataTypes) => {
  var Inmate = sequelize.define(
    "inmate",
    {
      inmateId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        field: "inmate_id"
      },
      firstName: {
        type: DataTypes.STRING,
        field: "first_name"
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name"
      },
      fullName: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "firstName",
          // "middleName", TODO check on middle name
          "lastName"
        ]),
        get: function () {
          return getOfficerFullName(
            this.get("firstName"),
            "", // this.get("middleName"),
            this.get("lastName")
          );
        }
      },
      region: {
        type: DataTypes.STRING
      },
      facility: {
        type: DataTypes.STRING
      },
      locationSub1: {
        type: DataTypes.STRING,
        field: "location_sub_1"
      },
      locationSub2: {
        type: DataTypes.STRING,
        field: "location_sub_2"
      },
      locationSub3: {
        type: DataTypes.STRING,
        field: "location_sub_3"
      },
      locationSub4: {
        type: DataTypes.STRING,
        field: "location_sub_4"
      },
      housing: {
        type: DataTypes.STRING
      },
      currentLocation: {
        type: DataTypes.STRING,
        field: "current_location"
      },
      status: {
        type: DataTypes.STRING
      },
      custodyStatus: {
        type: DataTypes.STRING,
        field: "custody_status"
      },
      custodyStatusReason: {
        type: DataTypes.TEXT,
        field: "custody_status_reason"
      },
      securityClassification: {
        type: DataTypes.STRING,
        field: "security_classification"
      },
      gender: {
        type: DataTypes.STRING
      },
      primaryEthnicity: {
        type: DataTypes.STRING,
        field: "primary_ethnicity"
      },
      race: {
        type: DataTypes.STRING
      },
      muster: {
        type: DataTypes.STRING
      },
      indigent: {
        type: DataTypes.BOOLEAN
      },
      releaseType: {
        type: DataTypes.STRING,
        field: "release_type"
      },
      classificationDate: {
        type: DataTypes.DATE,
        field: "classification_date"
      },
      bookingStartDate: {
        type: DataTypes.DATE,
        field: "booking_start_date"
      },
      tentativeReleaseDate: {
        type: DataTypes.DATE,
        field: "tentative_release_date"
      },
      bookingEndDate: {
        type: DataTypes.DATE,
        field: "booking_end_date"
      },
      actualReleaseDate: {
        type: DataTypes.DATE,
        field: "actual_release_date"
      },
      weekender: {
        type: DataTypes.BOOLEAN
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        field: "date_of_birth"
      },
      age: {
        type: DataTypes.INTEGER
      },
      countryOfBirth: {
        type: DataTypes.STRING,
        field: "country_of_birth"
      },
      citizenship: {
        type: DataTypes.STRING
      },
      religion: {
        type: DataTypes.STRING
      },
      language: {
        type: DataTypes.STRING
      },
      dateDeathRecorded: {
        type: DataTypes.DATE,
        field: "date_death_recorded"
      },
      sentenceLength: {
        type: DataTypes.STRING,
        field: "sentence_length"
      },
      onCount: {
        type: DataTypes.BOOLEAN,
        field: "on_count"
      },
      transferDate: {
        type: DataTypes.DATE,
        field: "transfer_date"
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    { tableName: "inmates" }
  );

  Inmate.associate = models => {
    Inmate.belongsToMany(models.cases, {
      through: models.caseInmate,
      foreignKey: {
        name: "inmateId",
        field: "inmate_id",
        allowNull: true
      }
    });
  };
  return Inmate;
};
