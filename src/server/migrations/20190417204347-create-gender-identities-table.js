"use strict";
const loadCsv = require("../seeder_jobs/loadCsv");
const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "gender_identities",
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
        "civilians",
        "gender_identity_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "gender_identities",
            key: "id"
          }
        },
        { transaction }
      );
    });
    return await loadCsv("genderIdentities.csv", models.gender_identity);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "civilians",
        "gender_identity_id",
        transaction
      );
      await queryInterface.dropTable("gender_identities", transaction);
    });
  }
};
