"use strict";
const TABLE = "facilities";

const INSERT_OTHER_INTO_FACILITIES = `INSERT INTO ${TABLE}(abbreviation, "name")
VALUES ('Other','Other')`;

const DELETE_CASES_WITH_OTHER_FACILITYID = `DELETE FROM cases WHERE facility_id = (SELECT id FROM ${TABLE} WHERE abbreviation = 'Other')`;

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
        await queryInterface.sequelize.query(
          DELETE_CASES_WITH_OTHER_FACILITYID
        );
        await queryInterface.sequelize.query(DELETE_OTHER_FROM_FACILITIES);
      }
    } catch (error) {
      throw new Error(
        `Error while seeding Facilites. Internal Error: ${error}`
      );
    }
  }
};
