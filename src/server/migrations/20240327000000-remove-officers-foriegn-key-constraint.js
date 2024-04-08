"use strict";

const TABLE = "public.officers";

const ADD_OLD_CONSTRAINT = `
  ALTER TABLE ONLY public.officers
  ADD CONSTRAINT officers_supervisor_officer_number_fkey 
  FOREIGN KEY (supervisor_officer_number) 
  REFERENCES public.officers(officer_number)`;

const DROP_CONSTRAINT_QUERY = `
  ALTER TABLE ${TABLE}
  DROP CONSTRAINT officers_supervisor_officer_number_fkey
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(DROP_CONSTRAINT_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while modifying foreign key to ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_OLD_CONSTRAINT, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting foreign key from ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
