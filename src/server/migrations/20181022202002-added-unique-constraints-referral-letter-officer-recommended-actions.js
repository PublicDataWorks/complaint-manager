"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addConstraint(
      "referral_letter_officer_recommended_actions",
      ["referral_letter_officer_id", "recommended_action_id", "deleted_at"],
      {
        type: "unique",
        name: "referral_letter_officer_recommended_actions_unique"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeConstraint(
      "referral_letter_officer_recommended_actions",
      "referral_letter_officer_recommended_actions_unique"
    );
  }
};
