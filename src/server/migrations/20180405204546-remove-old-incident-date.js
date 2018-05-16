"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases", "incident_date");
    await queryInterface.renameColumn(
      "cases",
      "incident_date_new",
      "incident_date"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "cases",
      "incident_date",
      "incident_date_new"
    );
    await queryInterface.addColumn("cases", "incident_date", {
      allowNull: true,
      type: Sequelize.DATE
    });
  }
};
