"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addConstraint(
        "referral_letter_officer_recommended_actions",
        ["recommended_action_id"],
        {
          type: "foreign key",
          name:
            "referral_letter_officer_recommended_actions_recommended_action_id_fkey",
          references: {
            table: "recommended_actions",
            field: "id"
          },
          transaction
        }
      );

      await queryInterface.addConstraint(
        "referral_letter_officer_recommended_actions",
        ["referral_letter_officer_id"],
        {
          type: "foreign key",
          name:
            "referral_letter_officer_recommended_actions_referral_letter_officer_id_fkey",
          references: {
            table: "referral_letter_officers",
            field: "id"
          },
          transaction
        }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        "referral_letter_officer_recommended_actions",
        "referral_letter_officer_recommended_actions_recommended_action_id_fkey",
        { transaction }
      );

      await queryInterface.removeConstraint(
        "referral_letter_officer_recommended_actions",
        "referral_letter_officer_recommended_actions_referral_letter_officer_id_fkey",
        { transaction }
      );
    });
  }
};
