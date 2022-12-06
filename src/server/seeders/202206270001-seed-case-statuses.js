"use strict";
const statuses = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/statuses`);
const TABLE = "case_statuses";

const INSERT_CASE_STATUSES = `INSERT INTO ${TABLE}(name, order_key) 
  VALUES `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = statuses.reduce((acc, elem, index) => {
      return `${acc} ('${elem}', ${index}),`;
    }, INSERT_CASE_STATUSES);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(query, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter_type data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(`TRUNCATE ${TABLE} CASCADE`, {
        transaction
      });
    });
  }
};
