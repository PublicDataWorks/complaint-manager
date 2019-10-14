"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    const migrationTableName = "sequelize_meta";
    const numberOfMigrationsToKeep = "1";

    await queryInterface.sequelize
      .query(
        `SELECT name from ${migrationTableName} ORDER BY name DESC LIMIT ${numberOfMigrationsToKeep}`
      )
      .then(([results, metadata]) => {
        const values = results.map(row => row.name);
        queryInterface.bulkDelete(migrationTableName, {
          name: {
            [Op.notIn]: values
          }
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      This migration is being used to squash previous migrations into a schema load. Once we perform this squash-ing, we don't intend to go back to the individual migrations. The code for the individual migrations has been deleted along with this squash-ing exercise.
    */
  }
};
