"use strict";

const FEATURE_TOGGLES_TABLE = "feature_toggles";

const INSERT_FEATURE_TOGGLE = `INSERT INTO ${FEATURE_TOGGLES_TABLE}(name, description, enabled, is_dev) 
  VALUES ('chooseComplaintType', 'Allows you to choose from a list of complaint types when creating a case', false, false)
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
                WHERE name = 'chooseComplaintType';`
    );
  }
};
