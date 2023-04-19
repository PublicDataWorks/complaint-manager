"use strict";

const TABLE = "cases_officers";

const ADD_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  ADD COLUMN person_type VARCHAR(50),
  ADD CONSTRAINT cases_officers_person_types_fk
  FOREIGN KEY (person_type)
  REFERENCES person_types(key)
`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT cases_officers_person_types_fk,
  DROP COLUMN person_type
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_CONSTRAINT_QUERY, {
          transaction
        });
        if (process.env.org === "NOIPM") {
          await queryInterface.sequelize.query(
            `UPDATE ${TABLE} SET person_type = 'CIVILIAN_WITHIN_PD' WHERE case_employee_type = 'Civilian Within NOPD'`,
            { transaction }
          );
          await queryInterface.sequelize.query(
            `UPDATE ${TABLE} SET person_type = 'KNOWN_OFFICER' WHERE case_employee_type = 'Officer' AND last_name IS NOT NULL`,
            { transaction }
          );
          await queryInterface.sequelize.query(
            `UPDATE ${TABLE} SET person_type = 'UNKNOWN_OFFICER' WHERE case_employee_type = 'Officer' AND last_name IS NULL`,
            { transaction }
          );
        }
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
      });
    } catch (error) {
      throw new Error(
        `Error while removing foreign key from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
