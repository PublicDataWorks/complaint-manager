"use strict";

const QUERY_REFERRAL_LETTER_TYPE =
  "SELECT editable_template FROM letter_types WHERE type = 'REFERRAL'";
const UPDATE_REFERRAL_LETTER_TEMPLATE =
  "UPDATE letter_types SET editable_template = <<template>> WHERE type = 'REFERRAL'";

const OLD_TEXT = `{{#if (isEqual letterOfficer.officerHistoryOptionId 3) ~}}
  <p>
    The OIPM was unable to review <strong>{{rank}} {{fullName~}}'s</strong> history for the last five years
    because there was no officer
    disciplinary history available in the NOPD IAPro.
  </p>
  <br />
  {{/if ~}}`;

const NEW_TEXT = `{{#if (isEqual letterOfficer.officerHistoryOptionId 3) ~}}
  <p>
    The OIPM was unable to review <strong>{{rank}} {{fullName~}}'s</strong> history for the last five years
    because there was no officer
    disciplinary history available in the NOPD IAPro.
  </p>
  <br />
  {{/if ~}}
  {{#if (isEqual letterOfficer.officerHistoryOptionId 5) ~}}
  <p>
    The OIPM was unable to review <strong>{{rank}} {{fullName~}}'s</strong> history for the last five years at this 
    time but may supplement this complaint with this information at a future date.
  </p>
  <br />
  {{/if ~}}`;

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
        `Error while updating template with officer history option. Internal Error: ${error}`
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
              .replace(NEW_TEXT, OLD_TEXT)
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
