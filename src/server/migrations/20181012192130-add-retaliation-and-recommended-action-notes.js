"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      queryInterface.addColumn(
        "referral_letters",
        "include_retaliation_concerns",
        {
          type: Sequelize.BOOLEAN,
          transaction
        }
      );
      queryInterface.addColumn(
        "referral_letter_officers",
        "recommended_action_notes",
        {
          type: Sequelize.TEXT,
          transaction
        }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      queryInterface.removeColumn(
        "referral_letters",
        "include_retaliation_concerns",
        {
          transaction
        }
      );
      queryInterface.removeColumn(
        "referral_letter_officers",
        "recommended_action_notes",
        {
          transaction
        }
      );
    });
  }
};
