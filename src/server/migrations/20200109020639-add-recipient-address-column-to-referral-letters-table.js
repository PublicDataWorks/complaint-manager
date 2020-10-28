"use strict";

import models from "../policeDataManager/models";
import {
  transformRecipientToTitleNameAndAddress,
  revertTitleNameAndAddressToRecipient
} from "../migrationJobs/transformRecipientToTitleNameAndAddress";

const selectReferralLettersQuery = "SELECT * FROM referral_letters";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const referralLetters = await models.sequelize.query(
        selectReferralLettersQuery,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      );

      await queryInterface.addColumn(
        "referral_letters",
        "recipient_address",
        { type: Sequelize.TEXT, defaultValue: null },
        { transaction }
      );

      await transformRecipientToTitleNameAndAddress(
        referralLetters,
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const referralLetters = await models.sequelize.query(
        selectReferralLettersQuery,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      );

      await revertTitleNameAndAddressToRecipient(referralLetters, transaction);

      await queryInterface.removeColumn(
        "referral_letters",
        "recipient_address",
        { transaction }
      );
    });
  }
};
