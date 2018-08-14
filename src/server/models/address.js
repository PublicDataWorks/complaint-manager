"use strict";

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
        type: DataTypes.STRING,
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
      paranoid: true
    }
  );

  Address.prototype.modelDescription = async function(transaction) {
    if (this.addressableType === "cases") {
      return [{ "Address Type": "Incident Location" }];
    }

    const civilian = await sequelize
      .model("civilian")
      .findById(this.addressableId, { transaction: transaction });

    return [
      { "Address Type": "Civilian" },
      { "Civilian Name": civilian.fullName }
    ];
  };

  Address.prototype.getCaseId = async function(transaction) {
    if (this.addressableType === "cases") {
      return this.addressableId;
    }
    const civilian = await sequelize
      .model("civilian")
      .findById(this.addressableId, {
        transaction: transaction
      });

    return civilian.caseId;
  };

  Address.auditDataChange();
  Address.updateCaseStatusAfterCreate();

  return Address;
};
