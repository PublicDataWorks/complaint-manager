"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "referral_letter_officers",
      "referral_letter_id"
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "referral_letter_officers",
      "referral_letter_id",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "referral_letters",
          key: "id"
        }
      }
    );
  }
};
