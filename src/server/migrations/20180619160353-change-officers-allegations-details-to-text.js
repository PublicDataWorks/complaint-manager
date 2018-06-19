"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("officers_allegations", "details", {
      allowNull: false,
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("officers_allegations", "details", {
      allowNull: false,
      type: Sequelize.STRING
    });
  }
};
