"use strict";
const Boom = require("boom");

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define(
    "address",
    {
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
      return "Incident Location";
    }

    const civilian = await sequelize
      .model("civilian")
      .findById(this.addressableId, { transaction: transaction });
    if (civilian) {
      return `Address for ${civilian.fullName}`;
    }

    throw Boom.badImplementation(
      "Civilian address cannot be created through nested include."
    );
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

    if (civilian) {
      return civilian.caseId;
    }

    throw Boom.badImplementation(
      "Civilian address cannot be created through nested include."
    );
  };

  Address.auditDataChange();

  return Address;
};
