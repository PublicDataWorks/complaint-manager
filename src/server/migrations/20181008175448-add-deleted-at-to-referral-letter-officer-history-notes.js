"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "referral_letter_officer_history_notes",
      "deleted_at",
      {
        type: Sequelize.DATE
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "referral_letter_officer_history_notes",
      "deleted_at"
    );
  }
};
