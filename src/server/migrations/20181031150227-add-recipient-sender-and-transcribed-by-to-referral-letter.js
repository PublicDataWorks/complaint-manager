"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn("referral_letters", "recipient", {
        type: Sequelize.TEXT,
        transaction
      });
      await queryInterface.addColumn("referral_letters", "sender", {
        type: Sequelize.TEXT,
        transaction
      });
      await queryInterface.addColumn("referral_letters", "transcribed_by", {
        type: Sequelize.STRING,
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "referral_letters",
        "recipient",
        transaction
      );
      await queryInterface.removeColumn(
        "referral_letters",
        "sender",
        transaction
      );
      await queryInterface.removeColumn(
        "referral_letters",
        "transcribed_by",
        transaction
      );
    });
  }
};
