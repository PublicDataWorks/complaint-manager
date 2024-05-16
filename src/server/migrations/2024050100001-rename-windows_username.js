"use strict";

const TABLE = "public.officers";

const REVERT_TO_WINDOWS_USERNAME= `
  ALTER TABLE ${TABLE} 
  RENAME COLUMN employee_id to windows_username
`;

const RENAME_TO_EMPLOYEE_ID = `
  ALTER TABLE ${TABLE}
  RENAME COLUMN windows_username to employee_id
`;

const MAKE_UNIQUE = `
  ALTER TABLE ${TABLE}
  ADD UNIQUE (employee_id)
`;

const MAKE_NOT_NULL = `
  ALTER TABLE ${TABLE}
  ALTER COLUMN employee_id SET NOT NULL
`;

const NO_UNIQUE = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT officers_employee_id_key`;

const MAKE_NULL = `
  ALTER TABLE ${TABLE}
  ALTER COLUMN windows_username DROP NOT NULL
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(RENAME_TO_EMPLOYEE_ID, {
          transaction
        });
      });
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(MAKE_UNIQUE, {
          transaction
        });
      });
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(MAKE_NOT_NULL, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while renaming windows_username from ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_TO_WINDOWS_USERNAME, {
          transaction
        });
      });
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(NO_UNIQUE, {
          transaction
        });
      });
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(MAKE_NULL, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting employee_id to ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
