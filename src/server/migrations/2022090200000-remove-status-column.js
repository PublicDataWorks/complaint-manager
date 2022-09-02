"use strict";

const GET_STATUSES_QUERY = "SELECT id, name FROM case_statuses";
const REMOVE_STATUS_QUERY = "ALTER TABLE cases DROP COLUMN status";
const RENAME_CURRENT_STATUS_QUERY =
  "ALTER TABLE cases RENAME COLUMN current_status TO status";
const UNDO_RENAME_CURRENT_STATUS_QUERY =
  "ALTER TABLE cases RENAME COLUMN status TO current_status";
const ADD_STATUS_QUERY = `ALTER TABLE cases
  ADD COLUMN status enum_cases_status
    DEFAULT 'Initial'::enum_cases_status
    NOT NULL`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        const statuses = await queryInterface.sequelize.query(
          GET_STATUSES_QUERY,
          {
            transaction
          }
        );

        await Promise.all(
          statuses[0].map(async status => {
            await queryInterface.sequelize.query(
              `update cases set current_status = ${status.id} where status = '${status.name}'`,
              {
                transaction
              }
            );
          })
        );

        await queryInterface.sequelize.query(REMOVE_STATUS_QUERY, {
          transaction
        });

        await queryInterface.sequelize.query(RENAME_CURRENT_STATUS_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing status column from cases. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(UNDO_RENAME_CURRENT_STATUS_QUERY, {
          transaction
        });

        await queryInterface.sequelize.query(ADD_STATUS_QUERY, {
          transaction
        });

        const statuses = await queryInterface.sequelize.query(
          GET_STATUSES_QUERY,
          {
            transaction
          }
        );

        await Promise.all(
          statuses[0].map(async status => {
            await queryInterface.sequelize.query(
              `update cases set status = '${status.name}' where current_status = ${status.id}`,
              {
                transaction
              }
            );
          })
        );
      });
    } catch (error) {
      throw new Error(
        `Error while undoing removal of status column. Internal Error: ${error}`
      );
    }
  }
};
