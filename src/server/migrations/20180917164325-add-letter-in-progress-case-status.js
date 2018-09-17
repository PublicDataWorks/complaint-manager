"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE enum_cases_status ADD VALUE 'Letter in Progress';`
    );

    await queryInterface.sequelize.query(
      `ALTER TYPE enum_cases_status RENAME TO enum_cases_status_old;`
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE enum_cases_status AS ENUM('Initial', 'Active', 'Letter in Progress', 'Ready for Review', 'Forwarded to Agency', 'Closed');`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status DROP DEFAULT;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status TYPE enum_cases_status USING status::text::enum_cases_status;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status SET DEFAULT 'Initial';`
    );
    await queryInterface.sequelize.query(`DROP TYPE enum_cases_status_old;`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE enum_cases_status RENAME TO enum_cases_status_old;`
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE enum_cases_status AS ENUM('Initial', 'Active', 'Ready for Review', 'Forwarded to Agency', 'Closed');`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status DROP DEFAULT;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status TYPE enum_cases_status USING status::text::enum_cases_status;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE cases ALTER COLUMN status SET DEFAULT 'Initial';`
    );
    await queryInterface.sequelize.query(`DROP TYPE enum_cases_status_old;`);
  }
};
