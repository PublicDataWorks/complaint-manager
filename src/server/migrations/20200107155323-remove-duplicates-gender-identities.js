"use strict";

import models from "../complaintManager/models";

const LAST_GOOD_GENDER_IDENTITY_ID = 6;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    await queryInterface.sequelize.transaction(async transaction => {
      try {
        const civiliansWithIncorrectGenderIdentityIds = await models.civilian.findAll(
          {
            where: {
              gender_identity_id: { [Op.gt]: LAST_GOOD_GENDER_IDENTITY_ID }
            }
          }
        );

        await civiliansWithIncorrectGenderIdentityIds.forEach(
          async civilianRow => {
            const genderIdentity = await models.gender_identity.findOne({
              attributes: ["name"],
              where: { id: civilianRow.genderIdentityId }
            });

            if (genderIdentity.name != null) {
              const correctId = await models.gender_identity.findOne({
                where: {
                  name: genderIdentity.name,
                  id: { [Op.lte]: LAST_GOOD_GENDER_IDENTITY_ID }
                }
              });

              civilianRow.genderIdentityId = correctId.id;
              civilianRow.save();
            }
          }
        );

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

        await duplicateRows.forEach(async duplicateRow => {
          await originalRows.forEach(async originalRow => {
            if (originalRow.name === duplicateRow.name) {
              await duplicateRow.destroy();
            }
          });
        });
      } catch (e) {
        console.error(e);
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Since we are reverting a bad state of data, we do not need a down migration.
    */
  }
};
