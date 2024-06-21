"use strict";

const TABLE = "facilities";

const INSERT_OTHER_INTO_FACILITIES = `INSERT INTO ${TABLE}(abbreviation, "name")
VALUES ('Other','Other')`;

const UPDATE_CASES_WITH_OTHER_FACILITYID = `UPDATE cases
SET facility_id = NULL
WHERE facility_id IN (
    SELECT id
    FROM facilities
    WHERE name = 'other'
)`;
const DELETE_OTHER_FROM_FACILITIES = `DELETE FROM ${TABLE} WHERE abbreviation = 'Other'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "HAWAII") {
        await queryInterface.sequelize.query(INSERT_OTHER_INTO_FACILITIES);
      }
    } catch (error) {
      throw new Error(
        `Error while seeding Facilites. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "HAWAII") {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize.query(
            UPDATE_CASES_WITH_OTHER_FACILITYID,
            { transaction }
          );
          await queryInterface.sequelize.query(DELETE_OTHER_FROM_FACILITIES, {
            transaction
          });
        });
      }
    } catch (error) {
      throw new Error(
        `Error while seeding Facilites. Internal Error: ${error}`
      );
    }
  }
};
