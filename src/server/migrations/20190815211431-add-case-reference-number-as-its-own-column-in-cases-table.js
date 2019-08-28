"use strict";

import { getCaseReference } from "../models/modelUtilities/getCaseReference";
import models from "../models";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let generalErrorMessage, caseId;
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        generalErrorMessage = "creating column for case reference number";
        await queryInterface.addColumn(
          "cases",
          "case_reference",
          {
            type: Sequelize.STRING
          },
          { transaction }
        );

        const allCases = await models.cases.findAll({ transaction });
        generalErrorMessage =
          "adding case reference to cases table for case id: ";
        for (let i = 0; i < allCases.length; i++) {
          caseId = allCases[i].id;
          await models.cases.update(
            {
              caseReference: getCaseReference(
                allCases[i].complaintType,
                allCases[i].caseNumber,
                allCases[i].year
              )
            },
            {
              where: {
                id: allCases[i].id
              },
              transaction,
              auditUser: "PROGRAMMATIC SQL MIGRATION"
            }
          );
        }

        generalErrorMessage = "adding constraint notNull for case_reference";
        await queryInterface.changeColumn(
          "cases",
          "case_reference",
          {
            type: Sequelize.STRING,
            allowNull: false
          },
          { transaction }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while ${generalErrorMessage}${
          caseId ? caseId : ""
        }. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.removeColumn("cases", "case_reference", {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating column for case reference number. Internal Error: ${error}`
      );
    }
  }
};
