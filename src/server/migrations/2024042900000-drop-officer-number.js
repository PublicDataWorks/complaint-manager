"use strict";

const TABLE = "public.officers";

const ADD_OFFICER_NUMBER = `
  ALTER TABLE ${TABLE}
  ADD officer_number INTEGER`;

const DROP_OFFICER_NUMBER = `
  ALTER TABLE ${TABLE}
  DROP officer_number
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_OFFICER_NUMBER, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while dropping officer number from ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_OFFICER_NUMBER, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while re-adding officer number to ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
