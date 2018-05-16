"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "cases",
      "narrative",
      "narrative_details"
    );

    await queryInterface.addColumn("cases", "narrative_summary", {
      type: Sequelize.STRING(500)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases", "narrative_summary");

    await queryInterface.renameColumn(
      "cases",
      "narrative_details",
      "narrative"
    );
  }
};
