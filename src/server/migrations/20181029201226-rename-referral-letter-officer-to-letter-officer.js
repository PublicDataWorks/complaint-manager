"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable(
      "referral_letter_officers",
      "letter_officers"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable(
      "letter_officers",
      "referral_letter_officers"
    );
  }
};
