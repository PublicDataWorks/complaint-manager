"use strict";
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

  Address.prototype.modelDescription = async (instance, options) => {
    let addressIdentifier;
    if (instance.addressableType === "cases") {
      addressIdentifier = "Incident Location";
    } else {
      const civilian = await sequelize
        .model("civilian")
        .findById(instance.addressableId, options);
      const civilianName = civilian.fullName;
      addressIdentifier = civilian ? `Address for ${civilianName}` : null;
    }
    return addressIdentifier;
  };

  Address.associate = models => {
    Address.belongsTo(models.cases, {
      foreignKey: {
        name: "addressableId",
        field: "addressable_id",
        allowNull: false
      }
    });
    Address.belongsTo(models.civilian, {
      foreignKey: {
        name: "addressableId",
        field: "addressable_id",
        allowNull: false,
        hooks: true
      }
    });
  };

  Address.auditDataChange();

  return Address;
};
