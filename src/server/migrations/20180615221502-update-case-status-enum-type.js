"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Forwarded to Agency';`)
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Ready for Review';`)
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Closed';`)
    await queryInterface.sequelize.query(`UPDATE cases SET status = 'Forwarded to Agency' WHERE status = 'Forwarded';`)
    await queryInterface.sequelize.query(`UPDATE cases SET status = 'Closed' WHERE status = 'Complete';`)

    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status RENAME TO enum_cases_status_old;`)
    await queryInterface.sequelize.query(`CREATE TYPE enum_cases_status AS ENUM('Initial', 'Active', 'Ready for Review', 'Forwarded to Agency', 'Closed');`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status DROP DEFAULT;`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status TYPE enum_cases_status USING status::text::enum_cases_status;`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status SET DEFAULT 'Initial';`)
    await queryInterface.sequelize.query(`DROP TYPE enum_cases_status_old;`)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Forwarded';`)
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Suspended';`)
    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status ADD VALUE 'Completed';`)
    await queryInterface.sequelize.query(`UPDATE cases SET status = 'Forwarded' WHERE status = 'Forwarded to Agency';`)
    await queryInterface.sequelize.query(`UPDATE cases SET status = 'Completed' WHERE status = 'Closed';`)

    await queryInterface.sequelize.query(`ALTER TYPE enum_cases_status RENAME TO enum_cases_status_old;`)
    await queryInterface.sequelize.query(`CREATE TYPE enum_cases_status AS ENUM('Initial', 'Active', 'Forwarded', 'Suspended', 'Closed');`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status DROP DEFAULT;`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status TYPE enum_cases_status USING status::text::enum_cases_status;`)
    await queryInterface.sequelize.query(`ALTER TABLE cases ALTER COLUMN status SET DEFAULT 'Initial';`)
    await queryInterface.sequelize.query(`DROP TYPE enum_cases_status_old;`)
  }
};
