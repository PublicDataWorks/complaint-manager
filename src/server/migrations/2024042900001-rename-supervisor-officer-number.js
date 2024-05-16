"use strict";

const TABLE = "public.officers";

const REVERT_TO_SUPERVISOR_OFFICER_NUMBER = `
  ALTER TABLE ${TABLE} 
  RENAME COLUMN supervisor_employee_id to supervisor_officer_number`;

const RENAME_TO_SUPERVISOR_EMPLOYEE_ID = `
  ALTER TABLE ${TABLE}
  RENAME COLUMN supervisor_officer_number to supervisor_employee_id
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(RENAME_TO_SUPERVISOR_EMPLOYEE_ID, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while renaming supervisor officer number from ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_TO_SUPERVISOR_OFFICER_NUMBER, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting supervisor officer number to ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
