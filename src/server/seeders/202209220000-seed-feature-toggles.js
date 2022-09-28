"use strict";

const INSERT_FEATURES = `INSERT INTO feature_toggles (name, description, enabled, is_dev)
    VALUES ('allowAccusedOfficersToBeBlankFeature', 'Accused can be blank', FALSE, FALSE),
    ('styleGuideFeature', 'Style Guide Feature', FALSE, FALSE),
    ('removeCaseNotesFeature', 'Case notes can be removed', FALSE, FALSE),
    ('realtimeNotificationsFeature', 'Realtime Notifications using Server-Sent Events', TRUE, FALSE),
    ('nonUserAuthenticationFeature', 'Authenticate through Auth0 without user credentials', FALSE, FALSE),
    ('searchCasesFeature', 'Search for cases using Elasticsearch', TRUE, FALSE),
    ('mapVisualizationFeature', 'Show maps on the private dashboard page', TRUE, FALSE),
    ('publicMapVisualizationFeature', 'Show maps on the public dashboard page', TRUE, FALSE),
    ('countByDistrictVisualizationFeature', 'show a bar-graph of the number of complaints per district', TRUE, FALSE),
    ('topAllegationsVisualizationFeature', 'show a bar-graph of the top 20 allegations', TRUE, FALSE)
    `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_FEATURES, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding table data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query("TRUNCATE feature_toggles CASCADE", {
        transaction
      });
    });
  }
};
