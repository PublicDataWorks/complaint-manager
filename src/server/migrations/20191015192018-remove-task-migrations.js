"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("task_migrations");
  },

  down: (queryInterface, Sequelize) => {
    /*
      We are moving away from task migrations.
      All migrations (data or schema related) should use a regular Sequelize migration in the migrations folder.
      Given this new setup, we will never need to re-created the task_migrations table.
    */
  }
};
