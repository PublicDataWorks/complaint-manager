"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("cases", "incident_location_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "addresses",
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("cases", "incident_location_id");
  }
};
