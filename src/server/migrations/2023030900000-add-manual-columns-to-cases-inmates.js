const ADD_COLUMNS_QUERY = `ALTER TABLE cases_inmates
  ADD notes TEXT,
  ADD first_name VARCHAR(75)`;

const DROP_COLUMNS_QUERY = `ALTER TABLE cases_inmates
  DROP COLUMN notes,
  DROP COLUMN first_name`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMNS_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while adding columns to table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_COLUMNS_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(`Error while dropping columns. Internal Error: ${error}`);
    }
  }
};
