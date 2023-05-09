"use strict";

const FEATURE_TOGGLES_TABLE = "feature_toggles";
const FLAG_NAME = "requireContactInfoForCivilians";
const ENABLED = process.env.ORG === "HAWAII" ? false : true;

const INSERT_FEATURE_TOGGLE = `INSERT INTO ${FEATURE_TOGGLES_TABLE}(name, description, enabled, is_dev) 
  VALUES ('${FLAG_NAME}', 'makes contact information required for manually entered civilian person types', ${ENABLED}, false)
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_FEATURE_TOGGLE, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding data into ${FEATURE_TOGGLES_TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DELETE FROM ${FEATURE_TOGGLES_TABLE} 
                WHERE name = '${FLAG_NAME}';`
    );
  }
};
