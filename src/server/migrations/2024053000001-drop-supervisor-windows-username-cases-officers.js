"use strict";

const TABLE = "public.cases_officers";

const ADD_SUPERVISOR_WINDOWS_USERNAME = `
  ALTER TABLE ${TABLE}
  ADD supervisor_windows_username INTEGER`;

const DROP_SUPERVISOR_WINDOWS_USERNAME = `
  ALTER TABLE ${TABLE}
  DROP supervisor_windows_username
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_SUPERVISOR_WINDOWS_USERNAME, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while dropping supervisor_windows_username from ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_SUPERVISOR_WINDOWS_USERNAME, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while re-adding supervisor_windows_username to ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
