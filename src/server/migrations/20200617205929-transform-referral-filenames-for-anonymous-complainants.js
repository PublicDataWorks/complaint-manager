"use strict";
import models from "../policeDataManager/models";
import {
  reverseTransformReferralLetterIfComplainantAnonymous,
  transformReferralLetterIfComplainantAnonymous
} from "../migrationJobs/transformReferralLetterIfComplainantAnonymous";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const referralLetters = await models.referral_letter.findAll({});

      try {
        await transformReferralLetterIfComplainantAnonymous(
          referralLetters,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const referralLetters = await models.referral_letter.findAll({});

      try {
        await reverseTransformReferralLetterIfComplainantAnonymous(
          referralLetters,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
  }
};
