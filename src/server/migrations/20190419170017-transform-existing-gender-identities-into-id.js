"use strict";

import models from "../models";
import {
  revertTransformCivilianGenderIdentityToId,
  transformCivilianGenderIdentityToId
} from "../migrationJobs/transformCivilianGenderIdentityToId";

const selectCiviliansQuery = "SELECT * from civilians;";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const genderIdentities = await models.gender_identity.findAll();

      await transformCivilianGenderIdentityToId(
        genderIdentities,
        civilians,
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const genderIdentities = await models.gender_identity.findAll();

      await revertTransformCivilianGenderIdentityToId(
        genderIdentities,
        civilians,
        transaction
      );
    });
  }
};
