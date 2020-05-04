"use strict";
import models from "../complaintManager/models";
import {
  revertTransformNarrativeDetailsToHTML,
  transformNarrativeDetailsToHTML
} from "../migrationJobs/transformNarrativeDetailsToHTML";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const cases = await models.cases.findAll({});
      try {
        await transformNarrativeDetailsToHTML(cases, transaction);
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const cases = await models.cases.findAll({});
      await revertTransformNarrativeDetailsToHTML(cases, transaction);
    });
  }
};
