"use strict";

module.exports = (sequelize, DataTypes) => {
  const HowDidYouHearAboutUsSource = sequelize.define(
    "how_did_you_hear_about_us_source",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { tableName: "how_did_you_hear_about_us_sources" }
  );

  return HowDidYouHearAboutUsSource;
};
