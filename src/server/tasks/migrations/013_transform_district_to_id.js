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

      await transformCasesDistrictToId(districts, cases, transaction);
      await transformOfficersDistrictToId(districts, officers, transaction);
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
