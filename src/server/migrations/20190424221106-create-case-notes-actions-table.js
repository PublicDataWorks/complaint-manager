"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "case_note_actions",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: { type: Sequelize.STRING, allow: false },
          created_at: { allowNull: false, type: Sequelize.DATE },
          updated_at: { allowNull: false, type: Sequelize.DATE }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "case_notes",
        "case_note_action_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "case_note_actions",
            key: "id"
          }
        },
        { transaction }
      );
    });
    return await loadCsv("caseNoteActionSeedData.csv", models.case_note_action);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "case_notes",
        "case_note_action_id",
        transaction
      );
      await queryInterface.dropTable("case_note_actions", transaction);
    });
  }
};
