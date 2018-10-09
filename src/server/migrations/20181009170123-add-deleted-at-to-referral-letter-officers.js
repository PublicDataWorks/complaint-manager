"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("referral_letter_officers", "deleted_at", {
      type: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "referral_letter_officers",
      "deleted_at"
    );
  }
};
