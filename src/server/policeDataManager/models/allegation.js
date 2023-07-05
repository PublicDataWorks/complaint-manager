"use strict";
module.exports = (sequelize, DataTypes) => {
  const Allegation = sequelize.define("allegation", {
    rule: {
      type: DataTypes.STRING,
      allowNull: false
    },

    paragraph: {
      type: DataTypes.STRING,
      allowNull: false
    },

    directive: {
      type: DataTypes.STRING,
      allowNull: false
    },

    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at"
    }
  });

  return Allegation;
};
