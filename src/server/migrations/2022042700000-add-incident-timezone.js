"use strict";
const moment = require("moment-timezone");

const ADD_COLUMN_QUERY = `ALTER TABLE cases 
  ADD COLUMN IF NOT EXISTS incident_timezone CHAR ( 3 )`;

const SELECT_DATE_QUERY = `SELECT id, incident_date
  FROM cases 
  WHERE incident_date IS NOT NULL`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE cases 
  DROP COLUMN IF EXISTS incident_timezone`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, { transaction });
        const cases = await queryInterface.sequelize.query(SELECT_DATE_QUERY, {
          transaction
        });
        cases[0].forEach(dateTime => {
          let timezone = moment
            .tz(dateTime.incident_date, "America/Chicago")
            .format("z");

          queryInterface.sequelize.query(
            `UPDATE cases SET incident_timezone = '${timezone}' WHERE id = ${dateTime.id}`
          );
        });
      });
    } catch (error) {
      throw new Error(
        `Error while restructuring cases table to add incident timezone. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REMOVE_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back incident timezone update. Internal Error: ${error}`
      );
    }
  }
};
