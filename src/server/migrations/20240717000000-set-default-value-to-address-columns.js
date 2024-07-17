const TABLE = "addresses";

const columns = ["city", "state", "zip_code", "country", "intersection"];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      columns.map(async columnName => {
        const QUERY = `ALTER TABLE ${TABLE} ALTER COLUMN ${columnName} SET DEFAULT ''`;
        await queryInterface.sequelize.query(QUERY);
      });
    } catch (error) {
      throw new Error(
        `Error while adding default value to ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      columns.map(async columnName => {
        const QUERY = `ALTER TABLE ${TABLE} ALTER COLUMN ${columnName} SET DEFAULT NULL`;
        await queryInterface.sequelize.query(QUERY);
      });
    } catch (error) {
      throw new Error(
        `Error while removing default value from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
