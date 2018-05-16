"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cases", "incident_date_new", {
      allowNull: true,
      type: Sequelize.DATEONLY
    });

    await queryInterface.addColumn("cases", "incident_time", {
      allowNull: true,
      type: Sequelize.TIME
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases", "incident_date_new");
    await queryInterface.removeColumn("cases", "incident_time");
  }
};
