"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn("referral_letters", "final_pdf_filename", {
        type: Sequelize.STRING,
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "referral_letters",
        "final_pdf_filename",
        transaction
      );
    });
  }
};
