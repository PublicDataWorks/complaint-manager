"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      "officer_history_options",
      {
        name: "Officer has significant/noteworthy history",
        updatedAt: Sequelize.fn("NOW")
      },
      {
        name: "Officer has signifcant/noteworthy history"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate(
      "officer_history_options",
      {
        name: "Officer has signifcant/noteworthy history",
        updatedAt: Sequelize.fn("NOW")
      },
      {
        name: "Officer has significant/noteworthy history"
      }
    );
  }
};
