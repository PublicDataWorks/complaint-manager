"use strict";

const QUERY_REFERRAL_LETTER_TYPE =
  "SELECT editable_template FROM letter_types WHERE type = 'REFERRAL'";
const UPDATE_REFERRAL_LETTER_TEMPLATE =
  "UPDATE letter_types SET editable_template = <<template>> WHERE type = 'REFERRAL'";

const OLD_TEXT =
  "{{#if (isPresent allegation.directive)}}: {{allegation.directive}}{{/if}}";

const NEW_TEXT =
  "{{#if (isPresent ruleChapter.name)}}: to wit NOPD {{ruleChapter.name}}{{#if (isPresent allegation.directive)}}, {{allegation.directive}}{{/if}}{{else}}{{#if (isPresent allegation.directive)}}: {{allegation.directive}}{{/if}}{{/if}}";

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
              .replace(OLD_TEXT, NEW_TEXT)
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
    if (process.env.ORG === "NOIPM") {
      await queryInterface.sequelize.transaction(async transaction => {
        const type = await queryInterface.sequelize.query(
          QUERY_REFERRAL_LETTER_TYPE,
          { transaction }
        );
        await queryInterface.sequelize.query(
          UPDATE_REFERRAL_LETTER_TEMPLATE.replace(
            "<<template>>",
            `'${type[0][0].editable_template
              .replace(NEW_TEXT, OLD_TEXT)
              .replace(/'/g, "''")}'`
          ),
          {
            transaction
          }
        );
      });
    }
  }
};
