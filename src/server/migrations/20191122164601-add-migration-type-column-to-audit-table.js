"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "audits",
        "manager_type",
        { type: Sequelize.STRING, allowNull: false, defaultValue: "complaint" },
        {
          transaction
        }
      );
      console.log("ABOUT TO CHANGE COLUMN");
      await queryInterface.changeColumn(
        "audits",
        "manager_type",
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: null
        },
        { transaction }
      );
      console.log("CHANGED COLUMN");
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("audits", "manager_type", {
        transaction
      });
    });
  }
};
