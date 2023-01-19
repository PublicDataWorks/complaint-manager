"use strict";

const TABLE = "letters";

const ADD_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN IF NOT EXISTS type_id INT
`;

const ADD_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  ADD CONSTRAINT letter_types_fk
  FOREIGN KEY (type_id)
  REFERENCES letter_types(id)
`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT letter_types_fk
`;

const DROP_COLUMN_QUERY = `
  ALTER TABLE ${TABLE}
  DROP COLUMN IF EXISTS type_id
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(ADD_CONSTRAINT_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while adding foreign key to ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_CONSTRAINT_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(DROP_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing foreign key from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
