const ADD_COLUMNS_QUERY = `ALTER TABLE cases_inmates
  ADD COLUMN person_type_key VARCHAR(50),
  ADD CONSTRAINT cases_inmates_person_types_fk
  FOREIGN KEY (person_type_key)
  REFERENCES person_types(key)
  `;

const DROP_COLUMNS_QUERY = `ALTER TABLE feature_toggles
  DROP CONSTRAINT cases_inmates_person_types_fk,
  DROP COLUMN person_type_key`;

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
