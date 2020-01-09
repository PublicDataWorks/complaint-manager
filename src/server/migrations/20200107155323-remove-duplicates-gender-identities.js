"use strict";

import models from "../complaintManager/models";
import {
  transformDuplicateGenderIdentityId
} from "../migrationJobs/transformDuplicateGenderIdentities";
import {deleteDuplicateRowsByName} from "../migrationJobs/deleteDuplicateRowsByName";

const LAST_GOOD_GENDER_IDENTITY_ID = 6;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    await queryInterface.sequelize.transaction(async transaction => {
      const civiliansWithIncorrectGenderIdentityIds = await models.civilian.findAll(
        {
          where: {
            gender_identity_id: { [Op.gt]: LAST_GOOD_GENDER_IDENTITY_ID }
          }
        }
      );
      try {
        await transformDuplicateGenderIdentityId(
          civiliansWithIncorrectGenderIdentityIds,
          LAST_GOOD_GENDER_IDENTITY_ID,
          Op,
          transaction
        );
      } catch (error) {
        console.log(error);
      }

      const duplicateRows = await models.gender_identity.findAll({
        where: {
          id: { [Op.gt]: LAST_GOOD_GENDER_IDENTITY_ID }
        }
      });

      const originalRows = await models.gender_identity.findAll({
        where: {
          id: { [Op.lte]: LAST_GOOD_GENDER_IDENTITY_ID }
        }
      });

      try {
        await deleteDuplicateRowsByName(duplicateRows, originalRows, transaction);
      }catch(error) {
        console.log(error)
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Since we are reverting a bad state of data, we do not need a down migration.
    */
  }
};
