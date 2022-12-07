"use strict";

const CONSTANTS = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const INSERT_CONFIGS = `INSERT INTO configs (name, value) 
  VALUES ('ORG_ACRONYM', '${CONSTANTS.ORGANIZATION}'), 
  ('ORG_NAME', '${CONSTANTS.ORGANIZATION_TITLE}'), 
  ('CITY', '${CONSTANTS.CITY}'), 
  ('POLICE_ACRONYM', '${CONSTANTS.PD}'), 
  ('IA_BUREAU', '${CONSTANTS.BUREAU}'), 
  ('IA_ACRONYM', '${CONSTANTS.BUREAU_ACRONYM}'), 
  ('FIRST_YEAR_DATA_IS_AVAILABLE', '${CONSTANTS.FIRST_YEAR_DATA_IS_AVAILABLE}')
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_CONFIGS, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding config data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query("TRUNCATE configs CASCADE", {
        transaction
      });
    });
  }
};
