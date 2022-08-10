"use strict";

const TABLE = "case_statuses";

const INSERT_CASE_STATUSES = `INSERT INTO ${TABLE}(name, order_key) 
  VALUES ('Initial', 0), 
  ('Active', 1), 
  ('Letter in Progress', 2), 
  ('Ready for Review', 3), 
  ('Forwarded to Agency', 4), 
  ('Closed', 5)
`;

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_CASE_STATUSES, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter_type data. Internal Error: ${error}`
      );
    }
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(`TRUNCATE ${TABLE} CASCADE`, {
        transaction
      });
    });
  }
};
