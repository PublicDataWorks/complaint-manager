"use strict";

const INSERT_CONFIGS = `INSERT INTO configs (name, value) 
  VALUES ('ORG_ACRONYM', 'OIPM'), 
  ('ORG_NAME', 'Office of the Independent Police Monitor'), 
  ('CITY', 'New Orleans'), 
  ('POLICE_ACRONYM', 'NOPD'), 
  ('IA_BUREAU', 'Public Integrity Bureau'), 
  ('IA_ACRONYM', 'PIB'), 
  ('FIRST_YEAR_DATA_IS_AVAILABLE', '2018')
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_CONFIGS, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
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
