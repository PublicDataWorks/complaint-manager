"use strict";

//We have to shorten these fields because postgres will truncate over a certain number of characters
//and sequelize uses long aliases when joining tables
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "number_historical_high_allegations",
        "num_historical_high_allegations",
        { transaction }
      );
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "number_historical_medium_allegations",
        "num_historical_med_allegations",
        { transaction }
      );
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "number_historical_low_allegations",
        "num_historical_low_allegations",
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "num_historical_high_allegations",
        "number_historical_high_allegations",
        { transaction }
      );
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "num_historical_med_allegations",
        "number_historical_medium_allegations",
        { transaction }
      );
      await queryInterface.renameColumn(
        "referral_letter_officers",
        "num_historical_low_allegations",
        "number_historical_low_allegations",
        { transaction }
      );
    });
  }
};
