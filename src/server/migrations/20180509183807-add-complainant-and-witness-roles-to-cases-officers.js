"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_cases_officers_role_on_case ADD VALUE 'Complainant'"
    );
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_cases_officers_role_on_case ADD VALUE 'Witness'"
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DELETE 
        FROM
            pg_enum
        WHERE
            (enumlabel = 'Complainant' OR enumlabel = 'Witness') 
        AND
            enumtypid = (
                SELECT
                    oid
                FROM
                    pg_type
                WHERE
                    typname = 'enum_cases_officers_role_on_case'
            )
    `);
  }
};
