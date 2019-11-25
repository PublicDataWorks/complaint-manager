"use strict";

import models from "../complaintManager/models";
import {
  transformCivilianTitleToId,
  revertTransformCivilianTitleToId
} from "../migrationJobs/transformCivilianTitleToId";

const selectCiviliansQuery = "SELECT * FROM civilians";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const civilianTitles = await models.civilian_title.findAll();

      await transformCivilianTitleToId(civilianTitles, civilians, transaction);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const civilians = await models.sequelize.query(selectCiviliansQuery, {
        type: models.sequelize.QueryTypes.SELECT
      });
      const civilianTitles = await models.civilian_title.findAll();

      await revertTransformCivilianTitleToId(
        civilianTitles,
        civilians,
        transaction
      );
    });
  }
};
