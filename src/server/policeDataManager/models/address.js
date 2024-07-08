"use strict";

import { ADDRESSABLE_TYPE } from "../../../sharedUtilities/constants";
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define(
    "address",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      addressableId: {
        type: DataTypes.INTEGER,
        field: "addressable_id"
      },
      addressableType: {
        type: DataTypes.ENUM([
          ADDRESSABLE_TYPE.CASES,
          ADDRESSABLE_TYPE.CIVILIAN
        ]),
        field: "addressable_type"
      },
      streetAddress: {
        type: DataTypes.STRING,
        field: "street_address"
      },

      intersection: {
        type: DataTypes.STRING
      },

      streetAddress2: {
        type: DataTypes.STRING,
        field: "street_address2"
      },

      city: {
        type: DataTypes.STRING,
        field: "city"
      },

      state: {
        type: DataTypes.STRING,
        field: "state"
      },

      zipCode: {
        type: DataTypes.STRING,
        field: "zip_code"
      },
      country: {
        type: DataTypes.STRING,
        field: "country"
      },
      lat: {
        type: DataTypes.FLOAT
      },
      lng: {
        type: DataTypes.FLOAT
      },
      placeId: {
        type: DataTypes.STRING,
        field: "place_id"
      },
      additionalLocationInfo: {
        type: DataTypes.STRING,
        field: "additional_location_info",
        set: function (value) {
          if (value !== null) {
            this.setDataValue("additionalLocationInfo", sanitize(value));
          }
        }
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
        beforeSave: (address, options) => {
          if (address.streetAddress)
            address.streetAddress = address.streetAddress.trim();

          if (address.streetAddress2)
            address.streetAddress2 = address.streetAddress2.trim();

          if (address.additionalLocationInfo)
            address.additionalLocationInfo = address.additionalLocationInfo.trim();
        }
      }
    }
  );

  Address.prototype.modelDescription = async function (transaction) {
    if (this.addressableType === ADDRESSABLE_TYPE.CASES) {
      return [{ "Address Type": "Incident Location" }];
    }

    const civilian = await sequelize
      .model("civilian")
      .findByPk(this.addressableId, { transaction: transaction });

    return [
      { "Address Type": "Civilian" },
      { "Civilian Name": civilian?.fullName }
    ];
  };

  Address.prototype.getCaseId = async function (transaction) {
    if (this.addressableType === ADDRESSABLE_TYPE.CASES) {
      return this.addressableId;
    }
    const civilian = await sequelize
      .model("civilian")
      .findByPk(this.addressableId, {
        transaction: transaction
      });

    return civilian?.caseId || this.addressableId;
  };

  Address.prototype.getManagerType = async function (transcation) {
    return "complaint";
  };

  Address.auditDataChange();
  Address.updateCaseStatusAfterCreate();

  return Address;
};
