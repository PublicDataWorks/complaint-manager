"use strict";

import { EMPLOYEE_TYPE } from "../../sharedUtilities/constants";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.addColumn(
          "cases_officers",
          "case_employee_type",
          {
            type: Sequelize.STRING,
            defaultValue: EMPLOYEE_TYPE.OFFICER,
            allowNull: false
          },
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while adding employee type column to cases officers. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.removeColumn(
          "cases_officers",
          "case_employee_type",
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing cases_employee_type column from cases_officers. Internal Error: ${error}`
      );
    }
  }
};
