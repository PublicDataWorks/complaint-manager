"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "how_did_you_hear_about_us_sources",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: { type: Sequelize.STRING, allow: false },
          createdAt: { allowNull: false, type: Sequelize.DATE },
          updatedAt: { allowNull: false, type: Sequelize.DATE }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "cases",
        "how_did_you_hear_about_us_source_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "how_did_you_hear_about_us_sources",
            key: "id"
          }
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn(
        "cases",
        "how_did_you_hear_about_us_source_id",
        transaction
      );
      await queryInterface.dropTable("how_did_you_hear_about_us_sources", transaction);
    });
  }
};
