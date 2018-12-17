"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "civilians",
        "title",
        {
          type: Sequelize.STRING(5)
        },
        { transaction }
      );

      let query = "UPDATE civilians SET title='N/A' WHERE title IS NULL";
      await queryInterface.sequelize.query(query, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("civilians", "title");
  }
};
