"use strict";
const CIVILIAN_INITIATED = require("../../sharedUtilities/constants")
  .CIVILIAN_INITIATED;
const RANK_INITIATED = require("../../sharedUtilities/constants")
  .RANK_INITIATED;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "cases",
        "complaint_type",
        {
          type: Sequelize.ENUM([CIVILIAN_INITIATED, RANK_INITIATED]),
          allowNull: false,
          defaultValue: CIVILIAN_INITIATED
        },
        {
          transaction
        }
      );

      let query = `UPDATE cases SET complaint_type = '${RANK_INITIATED}' WHERE complainant_type = 'Police Officer';`;
      await queryInterface.sequelize.query(query, {
        transaction
      });

      await queryInterface.removeColumn("cases", "complainant_type", {
        transaction
      });
      query = 'DROP TYPE "enum_cases_complainant_type";';
      await queryInterface.sequelize.query(query, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "cases",
        "complainant_type",
        {
          type: Sequelize.ENUM(["Civilian", "Police Officer"]),
          allowNull: false,
          defaultValue: "Civilian"
        },
        {
          transaction
        }
      );

      let query = `UPDATE cases SET complainant_type = 'Police Officer' WHERE complaint_type = '${RANK_INITIATED}';`;
      await queryInterface.sequelize.query(query, {
        transaction
      });

      await queryInterface.removeColumn("cases", "complaint_type", {
        transaction
      });
      query = 'DROP TYPE "enum_cases_complaint_type";';
      await queryInterface.sequelize.query(query, { transaction });
    });
  }
};
