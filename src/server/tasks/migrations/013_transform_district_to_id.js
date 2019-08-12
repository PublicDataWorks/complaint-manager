"use strict";

import models from "../../models";
import transformCasesDistrictToId, {
  revertTransformCasesDistrictToId
} from "../taskMigrationJobs/districtTransformationJobs/transformCasesDistrictToId";
import transformOfficersDistrictToId, {
  revertTransformOfficersDistrictToId
} from "../taskMigrationJobs/districtTransformationJobs/transformOfficersDistrictToId";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const cases = await models.cases.findAll({});
      const officers = await models.officer.findAll({});
      const districts = await models.district.findAll({});

      try {
        await transformCasesDistrictToId(districts, cases, transaction);
      } catch (error) {
        console.log(error);
      }

      try {
        await transformOfficersDistrictToId(districts, officers, transaction);
      } catch (error) {
        console.log(error);
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      const cases = await models.cases.findAll({});
      const officers = await models.officer.findAll({});
      const districts = await models.district.findAll({});

      await revertTransformCasesDistrictToId(districts, cases, transaction);

      await revertTransformOfficersDistrictToId(
        districts,
        officers,
        transaction
      );
    });
  }
};
