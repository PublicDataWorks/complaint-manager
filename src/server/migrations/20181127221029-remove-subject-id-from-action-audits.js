"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("action_audits", "subject_id");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("action_audits", "subject_id", {
      type: Sequelize.INTEGER
    });
  }
};
