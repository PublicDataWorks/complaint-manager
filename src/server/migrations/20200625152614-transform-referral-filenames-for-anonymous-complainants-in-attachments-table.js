"use strict";

import models from "../policeDataManager/models";
import {
  reverseTransformReferralLetterAttachmentsIfComplainantAnonymous,
  transformReferralLetterAttachmentsIfComplainantAnonymous
} from "../migrationJobs/transformReferralLetterAttachmentsIfComplainantAnonymous";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const attachments = await models.attachment.findAll({});

      try {
        await transformReferralLetterAttachmentsIfComplainantAnonymous(
          attachments,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const attachments = await models.attachment.findAll({});

      try {
        await reverseTransformReferralLetterAttachmentsIfComplainantAnonymous(
          attachments,
          transaction
        );
      } catch (error) {
        console.log(error);
      }
    });
  }
};
