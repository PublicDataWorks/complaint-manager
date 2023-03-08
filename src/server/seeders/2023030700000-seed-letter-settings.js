"use strict";
const TABLE = "letter_settings";

const INSERT_LETTER_SETTINGS = `INSERT INTO ${TABLE}(type, header_height, footer_height) 
  VALUES ('DEFAULT', '${process.env.ORG === "NOIPM" ? "1.3in" : "2.1in"}', '${
  process.env.ORG === "NOIPM" ? "0.7in" : "0.7in"
}')`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_LETTER_SETTINGS, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter_settings data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query("TRUNCATE letter_settings", {
          transaction
        });
      });
    } catch (e) {
      throw new Error(
        `Error while reverting letter_settings data. Internal Error: ${e}`
      );
    }
  }
};
