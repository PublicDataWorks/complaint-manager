const ADD_COLUMNS_QUERY = `ALTER TABLE cases_inmates
  ADD notes TEXT`;

const DROP_COLUMNS_QUERY = `ALTER TABLE cases_inmates
  DROP COLUMN notes`;

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
