"use strict";
module.exports = (sequelize, DataTypes) => {
  const Allegation = sequelize.define("allegation", {
    rule: {
      type: DataTypes.STRING
    },

    paragraph: {
      type: DataTypes.STRING
    },

    directive: {
      type: DataTypes.STRING
    },

    createdAt: {
      type: DataTypes.DATE,
      field: "created_at"
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at"
    }
  });

  return Allegation;
};
