"use strict";

import models from "../models";
import {
  revertTransformRaceEthnicityToId,
  transformRaceEthnicityToId
} from "../migrationJobs/transformRaceEthnicityToId";

const selectCiviliansQuery = "SELECT * FROM civilians;";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const raceEthnicities = await models.race_ethnicity.findAll();

      await transformRaceEthnicityToId(raceEthnicities, civilians, transaction);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const raceEthnicities = await models.race_ethnicity.findAll();

      await revertTransformRaceEthnicityToId(
        raceEthnicities,
        civilians,
        transaction
      );
    });
  }
};
