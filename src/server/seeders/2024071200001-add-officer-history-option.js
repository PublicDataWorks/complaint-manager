"use strict";

const TABLE = "officer_history_options";

const INSERT_UNABLE_INTO_HISTORY_OPTIONS = `INSERT INTO ${TABLE}(id, name, "createdAt", "updatedAt")
VALUES (5, 'OIPM unable to review at this time', NOW(), NOW())`;

const UPDATE_LETTER_OFFICERS_WITH_UNABLE = `UPDATE letter_officers
SET officer_history_option_id = NULL
WHERE officer_history_option_id IN (
    SELECT id
    FROM officer_history_options
    WHERE name = 'OIPM unable to review at this time'
)`;
const DELETE_UNABLE_FROM_HISTORY_OPTIONS = `DELETE FROM ${TABLE} WHERE name = 'OIPM unable to review at this time'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "NOIPM") {
        await queryInterface.sequelize.query(
          INSERT_UNABLE_INTO_HISTORY_OPTIONS
        );
      }
    } catch (error) {
      throw new Error(
        `Error while seeding officer history option. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "NOIPM") {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize.query(
            UPDATE_LETTER_OFFICERS_WITH_UNABLE,
            { transaction }
          );
          await queryInterface.sequelize.query(
            DELETE_UNABLE_FROM_HISTORY_OPTIONS,
            {
              transaction
            }
          );
        });
      }
    } catch (error) {
      throw new Error(
        `Error while seeding officer history option. Internal Error: ${error}`
      );
    }
  }
};
