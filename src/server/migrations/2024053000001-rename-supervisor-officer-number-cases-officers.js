"use strict";

const TABLE = "public.cases_officers";

const REVERT_TO_SUPERVISOR_OFFICER_NUMBER= `
  ALTER TABLE ${TABLE} 
  RENAME COLUMN supervisor_employee_id to supervisor_officer_number
`;

const REVERT_TO_WINDOWS_USERNAME= `
  ALTER TABLE ${TABLE} 
  RENAME COLUMN employee_id to windows_username
`;


const RENAME_TO_SUPERVISOR_EMPLOYEE_ID = `
  ALTER TABLE ${TABLE}
  RENAME COLUMN supervisor_officer_number to supervisor_employee_id
`;

const RENAME_TO_EMPLOYEE_ID = `
  ALTER TABLE ${TABLE}
  RENAME COLUMN windows_username to employee_id
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(RENAME_TO_EMPLOYEE_ID, {
          transaction
        });
        await queryInterface.sequelize.query(RENAME_TO_SUPERVISOR_EMPLOYEE_ID, {
            transaction
          });
      });
      
    } catch (error) {
      throw new Error(
        `Error while renaming windows_username and supervisor_officer_number from ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_TO_WINDOWS_USERNAME, {
          transaction
        });
        await queryInterface.sequelize.query(REVERT_TO_SUPERVISOR_OFFICER_NUMBER, {
            transaction
          });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting employee_id and supervisor_employee_id in ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
