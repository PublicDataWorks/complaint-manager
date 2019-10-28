"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameTable(
        "new_classifications",
        "classifications",
        transaction
      );
      await queryInterface.renameColumn(
        "case_classifications",
        "new_classification_id",
        "classification_id",
        transaction
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.renameTable(
        "classifications",
        "new_classifications",
        transaction
      );
      await queryInterface.renameColumn(
        "case_classifications",
        "classification_id",
        "new_classification_id",
        transaction
      );
    });
  }
};
