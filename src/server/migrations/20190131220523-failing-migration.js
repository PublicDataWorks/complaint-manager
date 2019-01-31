"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //can comment this task out after it runs in case models change in future
    throw new Error("Migration up failed");
  },
  down: async () => {
    throw new Error("Migration down failed");
  }
};
