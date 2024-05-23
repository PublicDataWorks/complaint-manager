"use strict";

const FEATURE_TOGGLES_TABLE = "feature_toggles";
const FLAG_NAME = "displayAllStatusInDashboard";

const UPDATE_FEATURE_TOGGLE = `UPDATE ${FEATURE_TOGGLES_TABLE} SET enabled = true WHERE name = '${FLAG_NAME}'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "NOIPM") {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize.query(UPDATE_FEATURE_TOGGLE, {
            transaction
          });
        });
      }
    } catch (error) {
      throw new Error(
        `Error while seeding data into ${FEATURE_TOGGLES_TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "NOIPM") {
      await queryInterface.sequelize.query(
        `DELETE FROM ${FEATURE_TOGGLES_TABLE} 
                WHERE name = '${FLAG_NAME}';`
      );
    }
  }
};
