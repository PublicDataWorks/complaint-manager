"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `UPDATE cases SET (incident_time, incident_date_new) = (incident_date::time, incident_date::date);`
    );
  },

  down: async (queryInterface, Sequelize) => {}
};
