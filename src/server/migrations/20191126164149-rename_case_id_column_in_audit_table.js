"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn("audits", "case_id", "reference_id", {
        transaction
      });
      await queryInterface.removeConstraint("audits", "audits_case_id_fkey", {
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameColumn("audits", "reference_id", "case_id", {
        transaction
      });
      await queryInterface.changeColumn(
        "audits",
        "case_id",
        {
          type: Sequelize.INTEGER,
          references: {
            model: "cases",
            key: "id"
          }
        },
        {
          transaction
        }
      );
    });
  }
};
