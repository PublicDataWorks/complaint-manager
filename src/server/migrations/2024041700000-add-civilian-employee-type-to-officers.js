const ADD_VALUE_TO_EMPLOYEE_TYPE_ENUM = `
  ALTER TYPE enum_officers_employee_type RENAME TO enum_officers_employee_type_old;
  CREATE TYPE enum_officers_employee_type AS ENUM('Commissioned', 'Non-Commissioned', 'Recruit', 'Civilian');
  ALTER TABLE officers
    ALTER COLUMN employee_type TYPE enum_officers_employee_type
    USING employee_type::text::enum_officers_employee_type;
  DROP TYPE enum_officers_employee_type_old;
`;

const REMOVE_VALUE_FROM_EMPLOYEE_TYPE_ENUM = `
  ALTER TYPE enum_officers_employee_type RENAME TO enum_officers_employee_type_old;
  CREATE TYPE enum_officers_employee_type AS ENUM('Commissioned', 'Non-Commissioned', 'Recruit', 'Civilian');
  ALTER TABLE officers
    ALTER COLUMN employee_type TYPE enum_officers_employee_type
    USING employee_type::text::enum_officers_employee_type;
  DROP TYPE enum_officers_employee_type_old;
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(ADD_VALUE_TO_EMPLOYEE_TYPE_ENUM);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(REMOVE_VALUE_FROM_EMPLOYEE_TYPE_ENUM);
  }
};
