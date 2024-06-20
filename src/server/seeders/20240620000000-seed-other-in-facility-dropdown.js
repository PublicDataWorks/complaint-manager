"use strict";
const TABLE = "facilities";

const INSERT_OTHER = `INSERT INTO ${TABLE}(abbreviation, "name")
VALUES ('Other','Other')`;
const DELETE_OTHER = `DELETE FROM ${TABLE} WHERE abbreviation = 'Other'`;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "HAWAII") {
        await queryInterface.sequelize.query(INSERT_OTHER);
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
        await queryInterface.sequelize.query(DELETE_OTHER);
      }
    } catch (error) {
      throw new Error(
        `Error while seeding Facilites. Internal Error: ${error}`
      );
    }
  }
};
