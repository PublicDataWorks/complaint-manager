"use strict";

const QUERY_REFERRAL_LETTER_TYPE =
  "SELECT editable_template FROM letter_types WHERE type = 'REFERRAL'";
const UPDATE_REFERRAL_LETTER_TEMPLATE =
  "UPDATE letter_types SET editable_template = <<template>> WHERE type = 'REFERRAL'";

const OLD_TEXT = "allegation.directive";

const NEW_TEXT = "directive.name";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      if (process.env.ORG === "NOIPM") {
        await queryInterface.sequelize.transaction(async transaction => {
          const type = await queryInterface.sequelize.query(
            QUERY_REFERRAL_LETTER_TYPE,
            { transaction }
          );
          const updateQuery = UPDATE_REFERRAL_LETTER_TEMPLATE.replace(
            "<<template>>",
            `'${type[0][0].editable_template
              .replaceAll(OLD_TEXT, NEW_TEXT)
              .replace(/'/g, "''")}'`
          );
          await queryInterface.sequelize.query(updateQuery, {
            transaction
          });
        });
      }
    } catch (error) {
      throw new Error(
        `Error while updating template with chapters. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const type = await queryInterface.sequelize.query(
        QUERY_REFERRAL_LETTER_TYPE,
        { transaction }
      );
      if (type?.length && type[0].length && type[0][0].editable_template) {
        await queryInterface.sequelize.query(
          UPDATE_REFERRAL_LETTER_TEMPLATE.replace(
            "<<template>>",
            `'${type[0][0].editable_template
              .replaceAll(NEW_TEXT, OLD_TEXT)
              .replace(/'/g, "''")}'`
          ),
          {
            transaction
          }
        );
      }
    });
  }
};
